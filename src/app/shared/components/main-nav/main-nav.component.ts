import { Component, OnInit } from "@angular/core"
import { MatDialog } from "@angular/material/dialog"
import { Observable } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { LoginDialogComponent } from "../login-dialog/login-dialog.component"
import { RegistrationDialogComponent } from "../registration-dialog/registration-dialog.component"

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit {
  showHamburgerMenu: Observable<boolean>

  constructor(
    private breakpointService: BreakpointService,
    private dialog: MatDialog,
  ) {}

  openLoginDialog() {
    console.log("Opening login dialog")
    this.dialog.open(LoginDialogComponent)
  }

  openRegistrationDialog() {
    console.log("Opening register dialog")
    this.dialog.open(RegistrationDialogComponent)
  }

  ngOnInit() {
    this.showHamburgerMenu = this.showHamburgerMenu =
      this.breakpointService.isHandsetOrSmall()
  }
}
