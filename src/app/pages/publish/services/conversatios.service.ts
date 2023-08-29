import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ConversationsService {
  private showConversationsSource = new BehaviorSubject<boolean>(false)
  showConversations$ = this.showConversationsSource.asObservable()

  toggleConversations() {
    const currentValue = this.showConversationsSource.getValue()
    this.showConversationsSource.next(!currentValue)
  }
}
