import { Component, OnInit, inject } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Observable, of} from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { LoginDialogComponent } from "../login-dialog/login-dialog.component"
import { RegistrationDialogComponent } from "../registration-dialog/registration-dialog.component"
import { LocationSelectComponent } from "../location-select/location-select.component"
import { AuthService } from "src/app/services/auth.service"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { ChatService } from "src/app/services/chat.service"

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

  protected showHamburgerMenu: Observable<boolean>
  protected cityName: string
  protected incomingMessagesCount = 20
  protected totalUnread$ = of(0)
  protected user$ =  this._authService.getUser()

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
    this.showHamburgerMenu = this._breakpointService.isHandsetOrSmall()
    this._locationService.city$.subscribe((city) => {
      this.cityName = city?.name ?? "Localização"
    })
    // TODO initialize chat service
    //await this._chatService.initialize()
    this.totalUnread$ = this._chatService.getTotalUnreadMessagesCount()
  }
}
