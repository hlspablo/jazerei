import { Timestamp } from "@firebase/firestore-types"

export function sleepFor(milliseconds = 100) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
export function convertTimestampToTime(timestamp: Timestamp) {
  const date = timestamp.toDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}
