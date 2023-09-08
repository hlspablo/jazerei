import { Injectable, inject } from "@angular/core"
import {
  Firestore,
  collectionData,
  addDoc,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  updateDoc,
} from "@angular/fire/firestore"
import { Observable, combineLatest, firstValueFrom, map, of, switchMap } from "rxjs"
import { Auth, user } from "@angular/fire/auth"
import { doc, getDoc } from "@angular/fire/firestore"
import {
  ChatRoom,
  Message,
  MyLocation,
  Profile,
  UserChatRoom,
} from "../shared/interfaces/app.interface"
import { switchValue } from "../utils/numbers.utils"

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private firestore = inject(Firestore)
  private auth: Auth = inject(Auth)
  user$ = user(this.auth)
  private totalUnread$: Observable<number>

  async initialize() {
    const chatRoomsObservable = await this.getChatRooms()
    this.totalUnread$ = chatRoomsObservable.pipe(map((result) => result.totalUnread))
  }

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

  async setAllMessagesToRead(chatRoomId: string, currentUserId: string): Promise<void> {
    const messagesCollection = collection(this.firestore, `chatRooms/${chatRoomId}/messages`)
    const unreadMessagesQuery = query(
      messagesCollection,
      where("read", "==", false),
      where("userId", "!=", currentUserId),
    )
    const querySnapshot = await getDocs(unreadMessagesQuery)

    const updatePromises: Promise<void>[] = []
    querySnapshot.forEach((documentSnapshot) => {
      const messageId = documentSnapshot.id
      const messageRef = doc(this.firestore, `chatRooms/${chatRoomId}/messages/${messageId}`)
      updatePromises.push(updateDoc(messageRef, { read: true }))
    })
    await Promise.all(updatePromises)
  }

  getUnreadMessagesCount(chatRoomId: string, currentUserId: string): Observable<number> {
    const messagesCollection = collection(this.firestore, `chatRooms/${chatRoomId}/messages`)
    const unreadMessagesQuery = query(
      messagesCollection,
      where("read", "==", false),
      where("userId", "!=", currentUserId),
    )
    const unreadMessagesData = collectionData(unreadMessagesQuery, { idField: "id" }) as Observable<
      Message[]
    >
    return unreadMessagesData.pipe(map((messages: Message[]) => messages.length))
  }

  getTotalUnreadMessagesCount(): Observable<number> {
    return this.totalUnread$
  }

  async getChatRooms(): Promise<Observable<{ rooms: UserChatRoom[]; totalUnread: number }>> {
    const currentUser = await firstValueFrom(this.user$)
    if (!currentUser) throw new Error("Must be logged to get chat rooms")

    const chatRoomsCollection = collection(this.firestore, "chatRooms")
    const chatRoomsQuery = query(
      chatRoomsCollection,
      where("members", "array-contains", currentUser.uid),
    )

    const chatRoomsData = collectionData(chatRoomsQuery, { idField: "id" }) as Observable<
      ChatRoom[]
    >

    return chatRoomsData.pipe(
      switchMap((chatRooms: ChatRoom[]) => {
        const unreadCounts = chatRooms.map((room) =>
          this.getUnreadMessagesCount(room.id, currentUser.uid),
        )
        return combineLatest([of(chatRooms), ...unreadCounts])
      }),
      map(([chatRooms, ...unreadCounts]) => {
        const rooms = chatRooms.map((chatRoom, index) => {
          const chatRoomId = chatRoom.id
          const memberIndex = chatRoom.members.findIndex((memberId) => memberId === currentUser.uid)
          const rightIndex = switchValue(memberIndex)
          const location = chatRoom.locations[rightIndex]
          const userName = chatRoom.names[rightIndex]
          const gameName = chatRoom.relatedGameName
          const unreadMessages = unreadCounts[index]

          return {
            id: chatRoomId,
            location,
            userName,
            gameName,
            unreadMessages,
          }
        })

        const totalUnread = unreadCounts.reduce((acc, count) => acc + count, 0)

        return { rooms, totalUnread }
      }),
    )
  }

  async checkIfChatRoomExists(otherUserId: string, relatedGameId: string) {
    const currentUser = await firstValueFrom(this.user$)
    if (!currentUser) {
      throw new Error("Must be logged to check for existing chat rooms")
    }
    const chatRoomsCollection = collection(this.firestore, "chatRooms")
    const chatRoomsQuery = query(
      chatRoomsCollection,
      where("members", "array-contains", currentUser.uid),
      where("relatedGameId", "==", relatedGameId),
    )
    const chatRoomsData = await firstValueFrom(
      collectionData(chatRoomsQuery, { idField: "id" }) as Observable<ChatRoom[]>,
    )
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

  async createChatRoom(
    otherUserId: string,
    relatedGameId: string,
    relatedGameName: string,
    initialMessage?: string,
  ) {
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
      const { locationName: currentUserLocationName, name: currentUserName } =
        await this.getProfileFields(currentUser.uid)
      const members = [currentUser.uid, otherUserId]
      const names = [currentUserName, name]
      const locations = [currentUserLocationName, locationName]
      const chatRoomsCollection = collection(this.firestore, "chatRooms")
      await addDoc(chatRoomsCollection, {
        members,
        names,
        locations,
        relatedGameId,
        relatedGameName,
      })
    }
  }

  getMessages(chatRoomId: string) {
    const messagesCollection = collection(this.firestore, `chatRooms/${chatRoomId}/messages`)
    const messagesQuery = query(messagesCollection, orderBy("timestamp"))
    return collectionData(messagesQuery) as Observable<Message[]>
  }

  async sendMessage(chatRoomId: string, message: string) {
    const currentUser = await firstValueFrom(this.user$)

    const messagesCollection = collection(this.firestore, `chatRooms/${chatRoomId}/messages`)
    return addDoc(messagesCollection, {
      message,
      timestamp: new Date(),
      userId: currentUser?.uid,
      read: false,
    })
  }
}
