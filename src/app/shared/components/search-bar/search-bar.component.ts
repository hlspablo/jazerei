import { Component, OnInit } from "@angular/core"
import { FormControl } from "@angular/forms"
import { inject } from "@angular/core"
import { SearchFilterService } from "src/app/services/search-filter.service"
import { debounceTime, tap } from "rxjs"
import { RxState } from "@rx-angular/state"

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
  providers: [RxState],
})
export class SearchBarComponent implements OnInit {
  private _searchFilterService = inject(SearchFilterService)

  protected searchGameInput = new FormControl()

  constructor(private _state: RxState<{}>) {}

  ngOnInit(): void {
    this._state.hold(
      this.searchGameInput.valueChanges.pipe(
        debounceTime(350),
        tap((value) => {
          this._searchFilterService.setSearch(value)
        }),
      ),
    )
  }
}
