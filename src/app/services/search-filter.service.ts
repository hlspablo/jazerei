import { Injectable } from "@angular/core"
import { Subject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class SearchFilterService {
  private searchSubject = new Subject<string>()
  searchQuery$ = this.searchSubject.asObservable()

  setSearch(searchQuery: string) {
    return this.searchSubject.next(searchQuery)
  }
}
