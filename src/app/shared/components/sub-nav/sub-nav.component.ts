import { Component, OnInit } from "@angular/core"
import { Observable } from "rxjs"
import { ConversationsService } from "src/app/services/conversatios.service"
import { BreakpointService } from "src/app/services/breakpoint-service.service"

@Component({
  selector: "app-sub-nav",
  templateUrl: "./sub-nav.component.html",
  styleUrls: ["./sub-nav.component.scss"],
})
export class SubNavComponent implements OnInit {
  showHamburgerMenu: Observable<boolean>
  constructor(
    private breakpointService: BreakpointService,
    private conversationsService: ConversationsService,
  ) {}

  toggleConversations() {
    this.conversationsService.toggleConversations()
  }

  ngOnInit() {
    this.showHamburgerMenu = this.showHamburgerMenu = this.breakpointService.isHandsetOrSmall()
  }
}
