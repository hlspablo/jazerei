import { Component, OnInit } from "@angular/core"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { Observable } from "rxjs"
import { ConversationsService } from "../services/conversatios.service"

@Component({
  selector: "app-chat-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  showHamburgerMenu: Observable<boolean>
  showConversations = false

  constructor(
    private breakpointService: BreakpointService,
    private conversationsService: ConversationsService,
  ) {}

  ngOnInit() {
    this.showHamburgerMenu = this.breakpointService.isHandsetOrSmall()

    this.conversationsService.showConversations$.subscribe((value) => {
      this.showConversations = value
    })
  }
}
