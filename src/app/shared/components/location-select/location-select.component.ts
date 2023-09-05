import { Component, OnInit, inject } from "@angular/core"
import { FormControl } from "@angular/forms"
import { Firestore, collectionData, collection, where, query } from "@angular/fire/firestore"
import { Observable, Subject, debounceTime, startWith, switchMap } from "rxjs"
import { MyLocation } from "../../interfaces/app.interface"
import { removeDiacritics } from "src/app/utils/string.utils"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { ToastrService } from "ngx-toastr"
import { MatDialog } from "@angular/material/dialog"

@Component({
  selector: "app-location-select",
  templateUrl: "./location-select.component.html",
  styleUrls: ["./location-select.component.scss"],
})
export class LocationSelectComponent implements OnInit {
  firestore: Firestore = inject(Firestore)
  searchControl = new FormControl()
  locationService = inject(LocationFilterService)
  toastr = inject(ToastrService)
  modalService = inject(MatDialog)

  searchTerms = new Subject<string>()
  private locationCollection = collection(this.firestore, "locations")
  protected locations$: Observable<MyLocation[]>


  onSearch(event: { term: string }) {
    const searchTerm = event.term
    const preparedSearchTerm = removeDiacritics(searchTerm.trim().toLowerCase())
    this.searchTerms.next(preparedSearchTerm)
  }

  removeFilter(){
    this.locationService.setCity(null)
    setTimeout(() => {
      this.toastr.success("Filtro removido com sucesso!")
      this.modalService.closeAll()
    }
    , 300)
  }

  onChange(event: MyLocation) {
    this.locationService.setCity(event)
    setTimeout(() => {
      this.toastr.success("Localização alterada com sucesso!")
      this.modalService.closeAll()
    }
    , 300)
  }

  private loadLocationsFromFirebase(term: string): Observable<MyLocation[]> {
    if (!term || term.trim() === "") {
      return new Observable((observer) => {
        observer.next([])
        observer.complete()
      })
    }
    const locationQuery = query(this.locationCollection, where("name_lowercase", ">=", term), where("name_lowercase", "<=", term + "\uf8ff"))
    return collectionData(locationQuery, { idField: "id" }) as Observable<MyLocation[]>
  }


  ngOnInit(): void {
    this.locations$ = this.searchTerms.pipe(
      startWith(""),
      debounceTime(200), // Wait for 300ms pause in events
      switchMap((term: string) => this.loadLocationsFromFirebase(term)),
    )
  }
}
