import { Timestamp } from "firebase/firestore"

export interface GameFirebaseRow {
  id: string
  name: string
  description: string
  owner: string
  ownerId: string
  imagesUrls: string[]
  consoleModel: string
}

export interface Message {
  message: string
  timestamp: Timestamp
  userId: string
  read: boolean
}

export interface MyLocation {
  id: string
  name: string
  name_lowercase: string
}

export interface ChatRoom {
  id: string
  members: string[]
  locations: string[]
  names: string[]
  relatedGameId: string
  relatedGameName: string
}

export interface UserChatRoom {
  id: string
  location: string
  userName: string
  gameName: string
  unreadMessages?: number
}

export interface Profile {
  name: string
  location: string // adjust according to your actual structure
}
