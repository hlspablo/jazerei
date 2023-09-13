import { Component, OnInit, inject } from "@angular/core"
import { where } from "@angular/fire/firestore"
import { debounceTime, switchMap } from "rxjs"
import { MyLocation } from "../../interfaces/app.interface"
import { removeDiacritics } from "src/app/utils/string.utils"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { ToastrService } from "ngx-toastr"
import { MatDialog } from "@angular/material/dialog"
import { RxActionFactory } from "@rx-angular/state/actions"
import { RxState } from "@rx-angular/state"
import { LocationRepository } from "src/app/repositories/location.repository"

interface UIActions {
  searchCity: string
  searchCityTrigger: void
  removeFilter: void
}
interface State {
  locations: MyLocation[]
}

@Component({
  selector: "app-location-select",
  templateUrl: "./location-select.component.html",
  styleUrls: ["./location-select.component.scss"],
  providers: [RxActionFactory, RxState],
})
export class LocationSelectComponent implements OnInit {
  private _locationService = inject(LocationFilterService)
  private _toastr = inject(ToastrService)
  private _modalService = inject(MatDialog)
  private _locationRepository = inject(LocationRepository)

  protected uiActions = new RxActionFactory<UIActions>().create()
  protected locations$ = this._state.select("locations")

  constructor(private _state: RxState<State>) {}

  onSearch(event: { term: string }) {
    this.uiActions.searchCity(removeDiacritics(event.term.trim().toLowerCase()))
  }

  removeFilter() {
    this._locationService.setCity(null)
    setTimeout(() => {
      this._toastr.success("Filtro removido com sucesso!")
      this._modalService.closeAll()
    }, 300)
  }

  onChange(event: MyLocation) {
    this._locationService.setCity(event)
    setTimeout(() => {
      this._toastr.success("Localização alterada com sucesso!")
      this._modalService.closeAll()
    }, 300)
  }

  ngOnInit(): void {
    this._state.connect(
      "locations",
      this.uiActions.searchCity$.pipe(
        debounceTime(300),
        switchMap((term) => {
          const queryConstraints = [
            where("name_lowercase", ">=", term),
            where("name_lowercase", "<=", term + "\uf8ff"),
          ]
          return this._locationRepository.getLocationsFilter(queryConstraints)
        }),
      ),
    )
  }
}
