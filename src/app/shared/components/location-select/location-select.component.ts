import { Component, OnInit, inject } from "@angular/core"
import { FormControl } from "@angular/forms"
import { Firestore, collectionData, collection } from "@angular/fire/firestore"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete"

interface Location {
  id: string
  name: string
}

@Component({
  selector: "app-location-select",
  templateUrl: "./location-select.component.html",
  styleUrls: ["./location-select.component.scss"],
})
export class LocationSelectComponent implements OnInit {
  showDropdown = false
  firestore: Firestore = inject(Firestore)

  searchControl = new FormControl()

  locations$: Observable<Location[]>
  filteredLocations$: Observable<Location[]>

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedLocation = event.option.value
    console.log("Selected location:", selectedLocation)
    // Perform any additional actions here
  }

  // Add this function
  displayFn(location: Location): string {
    return location && location.name ? location.name : ""
  }

  filterLocations(): void {
    const filterValue = this.searchControl.value.toLowerCase()
    this.filteredLocations$ = this.locations$.pipe(
      map((locations) =>
        locations.filter((location) =>
          location.name.toLowerCase().includes(filterValue),
        ),
      ),
    )
    this.showDropdown = true
  }

  ngOnInit(): void {
    const locations = collection(this.firestore, "locations")
    this.locations$ = collectionData(locations, {
      idField: "id",
    }) as Observable<Location[]>

    this.filteredLocations$ = this.locations$
  }
}