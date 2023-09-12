import { Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { Observable, map } from "rxjs"
import { ChatService } from "src/app/services/chat.service"
import { ChatMessageFirebaseRow, UserChatRoom } from "src/app/shared/interfaces/app.interface"
import { User } from "@angular/fire/auth"
import { AuthService } from "src/app/services/auth.service"
import { ConversationsService } from "../publish/services/conversatios.service"

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatPageComponent implements OnInit {
  private _chatService = inject(ChatService)
  private _breakpointService = inject(BreakpointService)
  private _conversationsService = inject(ConversationsService)

  protected showConversations$: Observable<boolean>
  protected isHandsetOrSmall$: Observable<boolean>
  protected chatRooms$: Observable<UserChatRoom[]>
  protected messages$: Observable<ChatMessageFirebaseRow[]>
  protected currentUser: User | null = null

  protected activeChatRoom: string
  protected currentMessageValue = ""

  @ViewChild("chatMessages", { static: false }) private chatMessages: ElementRef

  private scrollToBottom(): void {
    try {
      console.log(
        this.chatMessages.nativeElement.scrollHeight,
        this.chatMessages.nativeElement.scrollTop,
      )
      setTimeout(() => {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight
      }, 300)
    } catch (err) {
      console.log(err)
    }
  }

  setChatRoom(chatRoomId: string) {
    this.activeChatRoom = chatRoomId
    this.getMessages(chatRoomId)
    if (this.currentUser) {
      const currentUserId = this.currentUser.uid
      setTimeout(() => {
        this._chatService.setAllMessagesToRead(chatRoomId, currentUserId)
      }, 1500)
    }
  }

  async getMessages(chatRoomId: string) {
    this.messages$ = this._chatService.getMessages(chatRoomId)
    this.messages$.subscribe(() => {
      this.scrollToBottom()
      if (this.currentUser) {
        const currentUserId = this.currentUser.uid
        setTimeout(() => {
          this._chatService.setAllMessagesToRead(chatRoomId, currentUserId)
        }, 800)
      }
    })
  }

  sendMessage() {
    this._chatService.sendMessage(this.activeChatRoom, this.currentMessageValue)
    this.currentMessageValue = ""
  }

  handleEnterKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage()
    }
  }

  async ngOnInit() {
    this.isHandsetOrSmall$ = this._breakpointService.isHandsetOrSmall()
    this.showConversations$ = this._conversationsService.getShowConversations()
    // TODO enable chat Rooms
    //this.chatRooms$ = (await this.chatService.getChatRooms()).pipe(map((results) => results.rooms))
    if (this.activeChatRoom) {
      this.getMessages(this.activeChatRoom)
    }
  }
}
