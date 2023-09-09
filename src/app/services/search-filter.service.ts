import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class SearchFilterService {
  private searchSubject = new BehaviorSubject<string>("")
  searchQuery$ = this.searchSubject.asObservable()

  setSearch(searchQuery: string) {
    return this.searchSubject.next(searchQuery)
  }

  getSearch() {
    return this.searchSubject.value
  }
}
