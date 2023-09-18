/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as functions from "firebase-functions"

exports.makeLocationNameLowercase = functions.firestore
  .document("locations/{locationId}")
  .onWrite((change) => {
    const afterData = change.after.data()

    // Check if data exists
    if (!afterData) {
      functions.logger.warn("No data found after write.")
      return null
    }

    // Get the name value
    const original = afterData.name as string

    // Transform it
    const nameLowercase = original
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    // Update the document
    return change.after.ref.set(
      {
        name_lowercase: nameLowercase,
      },
      { merge: true },
    )
  })

exports.makeGameNameLowercase = functions.firestore.document("games/{gameId}").onWrite((change) => {
  const afterData = change.after.data()

  // Check if data exists
  if (!afterData) {
    functions.logger.warn("No data found after write.")
    return null
  }

  // Get the name value
  const original = afterData.name as string

  // Transform it
  const nameLowercase = original
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  // Update the document
  return change.after.ref.set(
    {
      name_lowercase: nameLowercase,
    },
    { merge: true },
  )
})
