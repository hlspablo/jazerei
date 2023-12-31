import { Component, inject } from "@angular/core"
import { AuthService } from "src/app/services/auth.service"
import { DialogService } from "src/app/services/local-dialog.service"
import { SlideMenuStateService } from "src/app/services/slide-menu-state.service"

@Component({
  selector: "app-sliding-menu",
  templateUrl: "./sliding-menu.component.html",
  styleUrls: ["./sliding-menu.component.scss"],
})
export class SlidingMenuComponent {
  private _authService = inject(AuthService)
  protected localDialogsService = inject(DialogService)
  protected slideMenu = inject(SlideMenuStateService)
  protected user$ = this._authService.getUser()

  logout() {
    this._authService.logout()
  }
}
