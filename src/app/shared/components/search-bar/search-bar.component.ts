import { Component } from "@angular/core"
import { FormControl } from "@angular/forms"
import { Observable } from "rxjs"
import { inject } from "@angular/core"
import { Firestore, collectionData, collection } from "@angular/fire/firestore"

interface Game {
  name: string
}

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.scss"],
})
export class SearchBarComponent {
  gameControl = new FormControl()
  firestore: Firestore = inject(Firestore)
  items$: Observable<Game[]>

  constructor() {
    const itemCollection = collection(this.firestore, "games")
    this.items$ = collectionData(itemCollection) as Observable<Game[]>
  }
}
