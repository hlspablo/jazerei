import { Component, OnInit, inject } from "@angular/core"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { Observable } from "rxjs"
import { ConversationsService } from "../services/conversatios.service"
import { ChatService } from "src/app/services/chat.service"
import { UserChatRoom } from "src/app/shared/interfaces/app.interface"

@Component({
  selector: "app-chat-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  showHamburgerMenu: Observable<boolean>
  showConversations = false
  private chatService = inject(ChatService)
  protected chatRooms$: Observable<UserChatRoom[]>

  constructor(
    private breakpointService: BreakpointService,
    private conversationsService: ConversationsService,
  ) {}

  async ngOnInit() {
    this.showHamburgerMenu = this.breakpointService.isHandsetOrSmall()

    this.conversationsService.showConversations$.subscribe((value) => {
      this.showConversations = value
    })
    this.chatRooms$ = await this.chatService.getChatRooms()
  }
}
