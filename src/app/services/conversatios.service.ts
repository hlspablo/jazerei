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

  closeConversations() {
    this.showConversationsSource.next(false)
  }
  showConversations() {
    this.showConversationsSource.next(true)
  }

  toggleConversations() {
    this.showConversationsSource.next(!this.showConversationsSource.getValue())
  }
}
