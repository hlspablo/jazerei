import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ConversationsService {
  private showConversationsSource = new BehaviorSubject<boolean>(false)
  private _showConversations$ = this.showConversationsSource.asObservable()

  getShowConversations() {
    return this._showConversations$
  }

  toggleConversations() {
    this.showConversationsSource.next(!this.showConversationsSource.getValue())
  }
}
