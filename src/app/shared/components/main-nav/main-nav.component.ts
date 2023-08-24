import { Component, OnInit } from "@angular/core"
import { Observable } from "rxjs"
import { BreakpointService } from "src/app/services/breakpoint-service.service"

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit {
  showHamburgerMenu: Observable<boolean>

  constructor(private breakpointService: BreakpointService) {}

  ngOnInit() {
    this.showHamburgerMenu = this.showHamburgerMenu =
      this.breakpointService.isHandsetOrSmall()
  }
}
