import { Injectable, inject } from "@angular/core"
import {
  Firestore,
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
import { AuthService, CompleteUser } from "../services/auth.service"
import { Observable, map } from "rxjs"
import { ChatMessageFirebaseRow, ChatRoom } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class ChatRoomRepository {
  private _firestore = inject(Firestore)
  private _authService = inject(AuthService)
  private _collection = collection(this._firestore, "chatRooms")

  async createChatRoom(
    currentUser: CompleteUser,
    receiverId: string,
    relatedGameId: string,
    relatedGameName: string,
  ) {
    const { location, name } = await this._authService.getProfile(receiverId)

    const members = [currentUser.uid, receiverId]
    const names = [currentUser.displayName, name]
    const locations = [currentUser.location.name, location.name]
    await addDoc(this._collection, {
      members,
      names,
      locations,
      relatedGameId,
      relatedGameName,
    })
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
      where("members", "array-contains", receivedId),
    )
    const chatRoomsDocs = await getDocs(chatRoomsQuery)

    return chatRoomsDocs.docs.length > 0 ? chatRoomsDocs.docs[0].data()["id"] : null
  }

  getChatRoomMessages(chatRoomId: string) {
    const messagesQuery = query(this.getMessagesCollection(chatRoomId), orderBy("timestamp"))
    return collectionData(messagesQuery) as Observable<ChatMessageFirebaseRow[]>
  }

  async writeChatRoomMessage(currentUser: CompleteUser, chatRoomId: string, message: string) {
    await addDoc(this.getMessagesCollection(chatRoomId), {
      userId: currentUser.uid,
      message,
      timestamp: Date(),
      read: false,
    })
  }
}
