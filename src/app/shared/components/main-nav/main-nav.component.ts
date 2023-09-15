import { Component, OnInit, inject } from "@angular/core"
import { Observable, map } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { AuthService } from "src/app/services/auth.service"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { ChatService } from "src/app/services/chat.service"
import { MyLocation } from "../../interfaces/app.interface"
import { RxEffects } from "@rx-angular/state/effects"
import { DialogService } from "src/app/services/local-dialog.service"
import { SlideMenuStateService } from "src/app/services/slide-menu-state.service"

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  providers: [RxEffects],
})
export class MainNavComponent {
  private _chatService = inject(ChatService)
  private _locationService = inject(LocationFilterService)
  private _breakpointService = inject(BreakpointService)
  private _authService = inject(AuthService)

  protected isHandsetOrSmall$ = this._breakpointService.isHandsetOrSmall()
  protected totalUnread$: Observable<number>
  protected selectedLocation$ = this._locationService.city$
  protected user$ = this._authService.getUser()
  protected localDialogsService = inject(DialogService)
  protected slideMenuService = inject(SlideMenuStateService)

  constructor(private _effects: RxEffects) {
    this._effects.register(this.user$, async (user) => {
      if (user) {
        this.totalUnread$ = this._chatService
          .getChatRooms()
          .pipe(map(({ totalUnread }) => totalUnread))
      }
    })
  }

  logout() {
    this._authService.logout()
  }
}
