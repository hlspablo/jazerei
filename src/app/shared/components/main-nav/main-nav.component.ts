import { Component, OnInit, inject } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Observable, map } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { LoginDialogComponent } from "../login-dialog/login-dialog.component"
import { RegistrationDialogComponent } from "../registration-dialog/registration-dialog.component"
import { LocationSelectComponent } from "../location-select/location-select.component"
import { AuthService } from "src/app/services/auth.service"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { ChatService } from "src/app/services/chat.service"
import { MyLocation } from "../../interfaces/app.interface"
import { RxEffects } from "@rx-angular/state/effects"

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
  providers: [RxEffects],
})
export class MainNavComponent implements OnInit {
  private _chatService = inject(ChatService)
  private _locationService = inject(LocationFilterService)
  private _breakpointService = inject(BreakpointService)
  private _dialogService = inject(MatDialog)
  private _authService = inject(AuthService)

  protected isHandsetOrSmall$: Observable<boolean>
  protected totalUnread$: Observable<number>
  protected selectedLocation$: Observable<MyLocation | null>

  protected user$ = this._authService.getUser()

  constructor(private _effects: RxEffects) {
    this._effects.register(this.user$, async (user) => {
      if (user) {
        this.totalUnread$ = this._chatService.getChatRooms().pipe(
          map(({ totalUnread }) => totalUnread),
        )
      }
    })
  }

  openLocationDialog() {
    this._dialogService.open(LocationSelectComponent, {
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  openLoginDialog() {
    this._dialogService.open(LoginDialogComponent, {
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  openRegistrationDialog() {
    this._dialogService.open(RegistrationDialogComponent, {
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  logout() {
    this._authService.logout()
  }

  async ngOnInit() {
    this.isHandsetOrSmall$ = this._breakpointService.isHandsetOrSmall()
    this.selectedLocation$ = this._locationService.city$
  }
}
