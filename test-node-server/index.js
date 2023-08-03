import 'dotenv/config'
import { Expo } from 'expo-server-sdk'

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

const TEST_PUSH_TOKEN = 'ExponentPushToken[SUUC12K670U6Qf6VbgSdwz]'

if (!Expo.isExpoPushToken(TEST_PUSH_TOKEN)) {
  throw new Error(
    `Push token ${TEST_PUSH_TOKEN} is not a valid Expo push token`,
  )
}

const TEST_MESSAGE = {
  to: TEST_PUSH_TOKEN,
  sound: 'default',
  body: 'This is a test notification, sent from NodeJS',
  data: { withSome: 'data' },
}

async function run() {
  const tickets = await sendMessages([TEST_MESSAGE])
  await waitMs(10_000) // wait 10 seconds before checking
  await readReceipts(tickets)
}

run()

async function sendMessages(messages) {
  let chunks = expo.chunkPushNotifications(messages)
  let tickets = []

  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk)
      console.log(ticketChunk)
      tickets.push(...ticketChunk)
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error)
    }
  }

  return tickets
}

async function readReceipts(tickets) {
  let receiptIds = []
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id)
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds)
  console.log({ receiptIds, receiptIdChunks })

  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk)
      console.log({ receipts })

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId]
        if (status === 'ok') {
          continue
        } else if (status === 'error') {
          console.error(`There was an error sending a notification: ${message}`)
          if (details && details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            console.error(`The error code is ${details.error}`)
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
