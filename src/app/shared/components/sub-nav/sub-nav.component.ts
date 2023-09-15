import { Component, inject } from "@angular/core"
import { ConversationsService } from "src/app/services/conversatios.service"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { DialogService } from "src/app/services/local-dialog.service"
import { RxEffects } from "@rx-angular/state/effects"
import { ChatService } from "src/app/services/chat.service"
import { Observable, map } from "rxjs"
import { AuthService } from "src/app/services/auth.service"

@Component({
  selector: "app-sub-nav",
  templateUrl: "./sub-nav.component.html",
  styleUrls: ["./sub-nav.component.scss"],
  providers: [RxEffects],
})
export class SubNavComponent {
  private _breakpointService = inject(BreakpointService)
  private _chatService = inject(ChatService)
  private _authService = inject(AuthService)

  protected isHandsetOrSmall$ = this._breakpointService.isHandsetOrSmall()
  protected localDialogsService = inject(DialogService)
  protected conversationsService = inject(ConversationsService)
  protected user$ = this._authService.getUser()
  protected totalUnread$: Observable<number>

  constructor(private _effects: RxEffects) {
    this._effects.register(this.user$, async (user) => {
      if (user) {
        this.totalUnread$ = this._chatService
          .getChatRooms()
          .pipe(map(({ totalUnread }) => totalUnread))
      }
    })
  }
}
