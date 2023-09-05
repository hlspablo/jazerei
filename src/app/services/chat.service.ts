import { Injectable, inject } from "@angular/core"
import { Firestore, collectionData, addDoc, collection, query, orderBy, where } from "@angular/fire/firestore"
import { Observable, firstValueFrom, map } from "rxjs"
import { Auth, user } from "@angular/fire/auth"
import { doc, getDoc } from "@angular/fire/firestore"
import { ChatRoom, MyLocation, Profile, UserChatRoom } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private firestore = inject(Firestore)
  private auth: Auth = inject(Auth)
  user$ = user(this.auth)

  async getProfileFields(otherUserId: string) {
    // TODO handle errors
    const profileDocRef = doc(this.firestore, `profiles/${otherUserId}`)
    const profileSnap = await getDoc(profileDocRef)
    const data = profileSnap.data() as Profile
    const name = data.name
    const locationRef = doc(this.firestore, `locations/${data.location}`)
    const locationSnap = await getDoc(locationRef)
    const myLocation = locationSnap.data() as MyLocation
    const locationName = myLocation.name
    return { name, locationName }
  }

  async getChatRooms(): Promise<Observable<UserChatRoom[]>> {
    const currentUser = await firstValueFrom(this.user$)
    if (!currentUser) throw new Error("Must be logged to get chat rooms")
    const chatRoomsCollection = collection(this.firestore, "chatRooms")
    const chatRoomsQuery = query(chatRoomsCollection, where("members", "array-contains", currentUser.uid))
    const chatRoomsData = collectionData(chatRoomsQuery, { idField: "id" }) as Observable<ChatRoom[]>
    return chatRoomsData.pipe(
      map((chatRooms: ChatRoom[]) => {
        return chatRooms.map((chatRoom) => {
          const index = chatRoom.members.findIndex((memberId) => memberId === currentUser.uid)
          const chatRoomId = chatRoom.id
          const location = chatRoom.locations[index]
          const userName = chatRoom.names[index]
          const gameName = chatRoom.relatedGameName
          const unreadMessages = 0

          return {
            id: chatRoomId,
            location,
            userName,
            gameName,
            unreadMessages,
          }
        })
      }),
    )
  }

  async checkIfChatRoomExists(otherUserId: string, relatedGameId: string) {
    const currentUser = await firstValueFrom(this.user$)
    if (!currentUser) {
      throw new Error("Must be logged to check for existing chat rooms")
    }

    // Initialize chat rooms collection reference and query
    const chatRoomsCollection = collection(this.firestore, "chatRooms")

    // Query to check if chat room exists with the same members and relatedGameId
    const chatRoomsQuery = query(
      chatRoomsCollection,
      where("members", "array-contains", currentUser.uid),
      where("relatedGameId", "==", relatedGameId),
    )

    // Execute the query
    const chatRoomsData = await firstValueFrom(collectionData(chatRoomsQuery, { idField: "id" }) as Observable<ChatRoom[]>)

    // Iterate through the results to confirm if the other user is also a member
    for (const chatRoom of chatRoomsData) {
      if (chatRoom.members.includes(otherUserId)) {
        return {
          exists: true,
          id: chatRoom.id,
        }
      }
    }

    return {
      exists: false,
      id: null,
    }
  }

  async createChatRoom(otherUserId: string, relatedGameId: string, relatedGameName: string, initialMessage?: string) {
    const { exists, id } = await this.checkIfChatRoomExists(otherUserId, relatedGameId)

    if (exists) {
      if (id && initialMessage) {
        this.sendMessage(id, initialMessage)
      }
    } else {
      const currentUser = await firstValueFrom(this.user$)
      if (!currentUser) {
        throw new Error("Must be logged to create chat rooms")
      }
      const { locationName, name } = await this.getProfileFields(otherUserId)
      const { locationName: currentUserLocationName, name: currentUserName } = await this.getProfileFields(currentUser.uid)
      const members = [currentUser.uid, otherUserId]
      const names = [currentUserName, name]
      const locations = [currentUserLocationName, locationName]
      const chatRoomsCollection = collection(this.firestore, "chatRooms")
      await addDoc(chatRoomsCollection, { members, names, locations, relatedGameId, relatedGameName })
    }
  }

  getMessages(chatRoomId: string) {
    const messagesCollection = collection(this.firestore, `chatRooms/${chatRoomId}/messages`)
    const messagesQuery = query(messagesCollection, orderBy("timestamp"))
    return collectionData(messagesQuery) as Observable<any[]>
  }

  async sendMessage(chatRoomId: string, message: string) {
    const currentUser = await firstValueFrom(this.user$)

    const messagesCollection = collection(this.firestore, `chatRooms/${chatRoomId}/messages`)
    return addDoc(messagesCollection, {
      message,
      timestamp: new Date(),
      userId: currentUser?.uid,
    })
  }
}
