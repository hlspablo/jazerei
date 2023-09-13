import { Component, OnInit, inject } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Observable, map, of} from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { LoginDialogComponent } from "../login-dialog/login-dialog.component"
import { RegistrationDialogComponent } from "../registration-dialog/registration-dialog.component"
import { LocationSelectComponent } from "../location-select/location-select.component"
import { AuthService } from "src/app/services/auth.service"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { ChatService } from "src/app/services/chat.service"
import { MyLocation } from "../../interfaces/app.interface"

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit {
  private _chatService = inject(ChatService)
  private _locationService = inject(LocationFilterService)
  private _breakpointService = inject(BreakpointService)
  private _dialogService = inject(MatDialog)
  private _authService = inject(AuthService)

  protected isHandsetOrSmall$: Observable<boolean>
  protected totalUnread$: Observable<number>
  protected user$ =  this._authService.getUser()
  protected selectedLocation$: Observable<MyLocation | null>

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
    this.totalUnread$ = (await this._chatService.getChatRooms()).pipe(
      map(({ totalUnread }) => totalUnread),
    )
  }
}
