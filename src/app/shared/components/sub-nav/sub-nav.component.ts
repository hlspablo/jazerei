import { Component, OnInit, inject } from "@angular/core"
import { Observable } from "rxjs"
import { ConversationsService } from "src/app/services/conversatios.service"
import { BreakpointService } from "src/app/services/breakpoint-service.service"

@Component({
  selector: "app-sub-nav",
  templateUrl: "./sub-nav.component.html",
  styleUrls: ["./sub-nav.component.scss"],
})
export class SubNavComponent implements OnInit {
  private _breakpointService = inject(BreakpointService)
  private conversationsService = inject(ConversationsService)

  protected isHandsetOrSmall$: Observable<boolean>


  toggleConversations() {
    this.conversationsService.toggleConversations()
  }

  ngOnInit() {
    this.isHandsetOrSmall$ = this._breakpointService.isHandsetOrSmall()
  }
}
