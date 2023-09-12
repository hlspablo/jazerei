import { Injectable, inject } from "@angular/core"
import { Observable, combineLatest, map, of, switchMap } from "rxjs"
import {
  ChatRoom,
  UserChatRoom,
} from "../shared/interfaces/app.interface"
import { switchValue } from "../utils/numbers.utils"
import { ChatRoomRepository } from "../repositories/chat-room.repository"
import { AuthService } from "./auth.service"

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private _chatRoomRepository = inject(ChatRoomRepository)
  private _authService = inject(AuthService)

  async createChatRoom(receiverId: string, relatedGameId: string, relatedGameName: string, initialMessage?: string) {
    const currentUser = await this._authService.getCurrentUserOrThrow()

    const chatRoomId = await this._chatRoomRepository.checkIfChatRoomExists(currentUser, receiverId, relatedGameId)
    if (chatRoomId) {
      if (initialMessage) {
        this.sendMessage(chatRoomId, initialMessage)
      } else  {
        this._chatRoomRepository.createChatRoom(currentUser, receiverId, relatedGameId, relatedGameName)
      }
    }
  }

  async getChatRooms(): Promise<Observable<{ rooms: UserChatRoom[]; totalUnread: number }>> {
    const currentUser = await this._authService.getCurrentUserOrThrow()
    const chatRooms$ = this._chatRoomRepository.getChatRooms(currentUser)

    return chatRooms$.pipe(
      switchMap((chatRooms: ChatRoom[]) => {
        const unreadCounts = chatRooms.map((room) =>
          this._chatRoomRepository.getChatRoomUnreadMessagesCount(room.id, currentUser.uid),
        )
        return combineLatest([of(chatRooms), ...unreadCounts])
      }),
      map(([chatRooms, ...unreadCounts]) => {
        const rooms = chatRooms.map((chatRoom, index) => {
          const chatRoomId = chatRoom.id
          const currentUserIndex = chatRoom.members.findIndex(
            (memberId) => memberId === currentUser.uid,
          )
          const receiverIndex = switchValue(currentUserIndex)
          const location = chatRoom.locations[receiverIndex]
          const userName = chatRoom.names[receiverIndex]
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

  getMessages(chatRoomId: string) {
    return this._chatRoomRepository.getChatRoomMessages(chatRoomId)
  }

  async sendMessage(chatRoomId: string, message: string) {
    const currentUser = await this._authService.getCurrentUserOrThrow()
    return this._chatRoomRepository.writeChatRoomMessage(currentUser, chatRoomId, message)
  }
}
