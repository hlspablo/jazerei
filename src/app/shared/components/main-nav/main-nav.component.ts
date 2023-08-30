import { Component, OnDestroy, OnInit, inject } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Observable, Subscription } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { LoginDialogComponent } from "../login-dialog/login-dialog.component"
import { RegistrationDialogComponent } from "../registration-dialog/registration-dialog.component"
import { MatMenuTrigger } from "@angular/material/menu"
import { LocationSelectComponent } from "../location-select/location-select.component"
import { Auth, User } from "@angular/fire/auth"
import { AuthService } from "src/app/services/auth.service"

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth)
  showHamburgerMenu: Observable<boolean>
  menuTrigger: MatMenuTrigger
  userSubscription: Subscription
  currentUser: User | null

  constructor(
    private breakpointService: BreakpointService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  openLocationDialog() {
    console.log("Opening location dialog")
    this.dialog.open(LocationSelectComponent, {
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  openLoginDialog() {
    console.log("Opening login dialog")
    this.dialog.open(LoginDialogComponent, {
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  openRegistrationDialog() {
    console.log("Opening register dialog")
    this.dialog.open(RegistrationDialogComponent, {
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  logout() {
    console.log("Logging out")
    this.authService.logout()
  }

  ngOnInit() {
    this.showHamburgerMenu = this.showHamburgerMenu =
      this.breakpointService.isHandsetOrSmall()

    this.currentUser = this.authService.getCachedUser()

    this.userSubscription = this.authService.user$.subscribe((updatedUser) => {
      this.currentUser = updatedUser
    })
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }
}
