import { Component, ElementRef, OnInit, ViewChild, inject } from "@angular/core"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { Observable, map, of, switchMap, withLatestFrom } from "rxjs"
import { ChatService } from "src/app/services/chat.service"
import { ChatMessageFirebaseRow, UserChatRoom } from "src/app/shared/interfaces/app.interface"
import { ConversationsService } from "../publish/services/conversatios.service"
import { RxState } from "@rx-angular/state"
import { RxEffects } from "@rx-angular/state/effects"
import { RxActionFactory } from "@rx-angular/state/actions"
import { AuthService } from "src/app/services/auth.service"

interface State {
  chatRooms: UserChatRoom[]
  activeChatRoom: string
  currentMessageValue: string
  messages: ChatMessageFirebaseRow[]
}

interface UIActions {
  sendMessage: {
    activeChatRoom: string
    currentMessageValue: string
  }
  sendMessageTrigger: void
}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  providers: [RxState, RxEffects, RxActionFactory],
})
export class ChatPageComponent implements OnInit {
  private _chatService = inject(ChatService)
  private _breakpointService = inject(BreakpointService)
  private _conversationsService = inject(ConversationsService)
  private _authService = inject(AuthService)

  protected showConversations$: Observable<boolean>
  protected isHandsetOrSmall$: Observable<boolean>

  protected chatRooms$ = this._state.select("chatRooms")
  protected messages$ = this._state.select("messages")
  protected activeChatRoom$ = this._state.select("activeChatRoom")
  protected currentMessageValue$ = this._state.select("currentMessageValue")

  protected user$ = this._authService.getUser()

  protected uiActions = new RxActionFactory<UIActions>().create()

  protected sendMessageAction$ = this.uiActions.sendMessageTrigger$.pipe(
    withLatestFrom(this.activeChatRoom$, this.currentMessageValue$),
    map(([_, activeChatRoom, currentMessageValue]) => ({ activeChatRoom, currentMessageValue })),
  )

  constructor(
    private _state: RxState<State>,
    private _effects: RxEffects,
  ) {
    this._effects.register(this.messages$, () => {
      this.scrollToBottom()
      setTimeout(() => {
        this._chatService.setAllMessagesToRead(this._state.get("activeChatRoom"))
      }, 600)
    })

    this._effects.register(this.user$, (user) => {
      if (!user) return
      this._state.connect(
        "chatRooms",
        this._chatService.getChatRooms().pipe(map(({ rooms }) => rooms)),
      )
    })

    this._state.hold(this.sendMessageAction$, ({ activeChatRoom, currentMessageValue }) => {
      this._chatService.sendMessage(activeChatRoom, currentMessageValue)
      this.updateMessageValue("")
    })
  }

  @ViewChild("chatMessages", { static: false }) private chatMessages: ElementRef

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight
      }, 300)
    } catch (err) {
      console.log(err)
    }
  }

  updateMessageValue(newValue: string) {
    this._state.set("currentMessageValue", (_) => newValue)
  }

  setChatRoom(chatRoomId: string) {
    this._state.set("activeChatRoom", (_) => chatRoomId)

    setTimeout(() => {
      this._chatService.setAllMessagesToRead(chatRoomId)
    }, 600)
  }

  handleEnterKey(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.uiActions.sendMessageTrigger()
    }
  }

  async ngOnInit() {
    this.isHandsetOrSmall$ = this._breakpointService.isHandsetOrSmall()
    this.showConversations$ = this._conversationsService.getShowConversations()

    this._state.connect(
      "messages",
      this._state.select("activeChatRoom").pipe(
        switchMap((activeChatRoom) => {
          if (activeChatRoom) {
            return this._chatService.getMessages(activeChatRoom)
          } else {
            return of([])
          }
        }),
      ),
    )
  }
}
