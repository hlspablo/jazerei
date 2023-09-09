import { Component, OnInit } from "@angular/core"
import { FormControl } from "@angular/forms"
import { inject } from "@angular/core"
import { SearchFilterService } from "src/app/services/search-filter.service"
import { debounceTime, tap } from "rxjs"

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent implements OnInit {
  gameControl = new FormControl()
  private searchFilterService = inject(SearchFilterService)

  ngOnInit(): void {
    this.gameControl.valueChanges
      .pipe(
        debounceTime(600), // Wait for 300ms pause in events
        tap((value) => {
          this.searchFilterService.setSearch(value) // Side-effect: update search query
        }),
      )
      .subscribe()
  }
}
