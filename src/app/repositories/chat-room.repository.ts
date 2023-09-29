import { Injectable, inject } from "@angular/core"
import {
  Firestore,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  doc,
  getDocs,
  orderBy,
  query,
  where,
  writeBatch,
} from "@angular/fire/firestore"
import { CompleteUser } from "../services/auth.service"
import { Observable, map } from "rxjs"
import { ChatMessageFirebaseRow, ChatRoom } from "../shared/interfaces/app.interface"
import { UserRepository } from "./user.repository"

@Injectable({
  providedIn: "root",
})
export class ChatRoomRepository {
  private _firestore = inject(Firestore)
  private _userRepository = inject(UserRepository)
  private _collection = collection(this._firestore, "chatRooms")

  async createChatRoom(
    currentUser: CompleteUser,
    receiverId: string,
    relatedGameId: string,
    relatedGameName: string,
  ): Promise<string> {
    const { locationName, name } = await this._userRepository.getProfile(receiverId)

    const members = [currentUser.uid, receiverId]
    const names = [currentUser.displayName, name]
    const locations = [currentUser.locationName, locationName]

    const docRef = await addDoc(this._collection, {
      members,
      names,
      locations,
      relatedGameId,
      relatedGameName,
    })

    return docRef.id
  }

  getChatRooms(currentUser: CompleteUser) {
    const chatRoomsQuery = query(
      this._collection,
      where("members", "array-contains", currentUser.uid),
    )
    return collectionData(chatRoomsQuery, { idField: "id" }) as Observable<ChatRoom[]>
  }

  private getMessagesCollection(chatRoomId: string) {
    return collection(this._firestore, `chatRooms/${chatRoomId}/messages`)
  }

  async setAllMessagesToRead(chatRoomId: string, currentUserId: string) {
    const unreadMessagesQuery = query(
      this.getMessagesCollection(chatRoomId),
      where("read", "==", false),
      where("userId", "!=", currentUserId),
    )
    const querySnapshot = await getDocs(unreadMessagesQuery)

    const batch = writeBatch(this._firestore)
    querySnapshot.forEach((documentSnapshot) => {
      const messageId = documentSnapshot.id
      const messageRef = doc(this._firestore, `chatRooms/${chatRoomId}/messages/${messageId}`)
      batch.update(messageRef, { read: true })
    })
    await batch.commit()
  }

  getChatRoomUnreadMessagesCount(chatRoomId: string, currentUserId: string): Observable<number> {
    const unreadMessagesQuery = query(
      this.getMessagesCollection(chatRoomId),
      where("read", "==", false),
      where("userId", "!=", currentUserId),
    )
    const unreadMessagesData = collectionData(unreadMessagesQuery, {
      idField: "id",
    }) as Observable<ChatMessageFirebaseRow[]>
    return unreadMessagesData.pipe(map((messages) => messages.length))
  }

  async checkIfChatRoomExists(
    currentUser: CompleteUser,
    receivedId: string,
    relatedGameId: string,
  ): Promise<string | null> {
    const chatRoomsQuery = query(
      this._collection,
      where("members", "array-contains", currentUser.uid),
      where("relatedGameId", "==", relatedGameId),
    )
    const chatRoomsDocs = await getDocs(chatRoomsQuery)

    const matchingChatRooms = chatRoomsDocs.docs.filter((doc) => {
      const data = doc.data() as ChatRoom
      const result = data.members.includes(receivedId)
      return result
    })

    return matchingChatRooms.length > 0 ? matchingChatRooms[0].id : null
  }

  getChatRoomMessages(chatRoomId: string) {
    const messagesQuery = query(this.getMessagesCollection(chatRoomId), orderBy("timestamp"))
    return collectionData(messagesQuery) as Observable<ChatMessageFirebaseRow[]>
  }

  async writeChatRoomMessage(currentUser: CompleteUser, chatRoomId: string, message: string) {
    await addDoc(this.getMessagesCollection(chatRoomId), {
      userId: currentUser.uid,
      message,
      timestamp: Timestamp.now(),
      read: false,
    })
  }
}
