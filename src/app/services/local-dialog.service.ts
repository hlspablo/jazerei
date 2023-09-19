import { Injectable } from "@angular/core"
import { LocationSelectComponent } from "../shared/components/location-select/location-select.component"
import { LoginDialogComponent } from "../shared/components/login-dialog/login-dialog.component"
import { RegistrationDialogComponent } from "../shared/components/registration-dialog/registration-dialog.component"
import { MatDialog } from "@angular/material/dialog"
import { BreakpointService } from "./breakpoint-service.service"
import { take } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class DialogService {
  constructor(
    private _dialogService: MatDialog,
    private _breakpointService: BreakpointService,
  ) {}

  openLocationDialog() {
    this.openDialog(LocationSelectComponent, "100%", "10vh")
  }

  openLoginDialog() {
    this.openDialog(LoginDialogComponent, "100%", "10vh")
  }

  openRegistrationDialog() {
    this.openDialog(RegistrationDialogComponent, "100%", "10vh")
  }

  private openDialog(component: any, width: string, top: string) {
    this._breakpointService
      .isHandsetOrSmall()
      .pipe(take(1))
      .subscribe((isHandsetOrSmall) => {
        this._dialogService.open(component, {
          autoFocus: true,
          delayFocusTrap: true,
          width: isHandsetOrSmall ? width : `calc(${width} / 2.5)`,
          position: {
            top,
          },
        })
      })
  }
}
