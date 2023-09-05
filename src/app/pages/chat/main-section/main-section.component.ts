import { Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { Observable, map } from "rxjs"
import { ConversationsService } from "../services/conversatios.service"
import { ChatService } from "src/app/services/chat.service"
import { Message, UserChatRoom } from "src/app/shared/interfaces/app.interface"
import { User } from "@angular/fire/auth"
import { AuthService } from "src/app/services/auth.service"

@Component({
  selector: "app-chat-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  private authService = inject(AuthService)
  private chatService = inject(ChatService)
  private breakpointService = inject(BreakpointService)
  private conversationsService = inject(ConversationsService)

  protected showConversations$: Observable<boolean>
  protected showHamburgerMenu$: Observable<boolean>
  protected chatRooms$: Observable<UserChatRoom[]>
  protected messages$: Observable<Message[]>
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
        this.chatService.setAllMessagesToRead(chatRoomId, currentUserId)
      }, 1500)
    }
  }

  async getMessages(chatRoomId: string) {
    this.messages$ = this.chatService.getMessages(chatRoomId)
    this.messages$.subscribe(() => {
      this.scrollToBottom()
      if (this.currentUser) {
        const currentUserId = this.currentUser.uid
        setTimeout(() => {
          this.chatService.setAllMessagesToRead(chatRoomId, currentUserId)
        }, 800)
      }
    })
  }

  sendMessage() {
    this.chatService.sendMessage(this.activeChatRoom, this.currentMessageValue)
    this.currentMessageValue = ""
  }

  handleEnterKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage()
    }
  }

  async ngOnInit() {
    this.showHamburgerMenu$ = this.breakpointService.isHandsetOrSmall()
    this.showConversations$ = this.conversationsService.showConversations$
    this.chatRooms$ = (await this.chatService.getChatRooms()).pipe(map((results) => results.rooms))
    this.authService.user$.subscribe((user) => {
      this.currentUser = user
    })
    if (this.activeChatRoom) {
      this.getMessages(this.activeChatRoom)
    }
  }
}
