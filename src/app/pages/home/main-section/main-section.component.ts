import { Component, OnInit, inject } from "@angular/core"
import { Observable } from "rxjs"
import { GameInfo } from "src/app/shared/interfaces/app.interface"
import { Firestore, collection, collectionData, query, where } from "@angular/fire/firestore"
import { LocationFilterService } from "src/app/services/location-filter.service"

@Component({
  selector: "app-home-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class HomeMainSectionComponent implements OnInit {
  private firestore = inject(Firestore)
  private gamesCollection = collection(this.firestore, "games")
  protected games$: Observable<GameInfo[]>
  private locationService = inject(LocationFilterService)

  ngOnInit() {
    this.games$ = collectionData(this.gamesCollection, {
      idField: "id",
    }) as Observable<GameInfo[]>

    this.locationService.city$.subscribe((city) => {
      if(city) {
        const gamesQuery = query(this.gamesCollection, where("location", "==", city.id));
        this.games$ = collectionData(gamesQuery, { idField: "id" }) as Observable<GameInfo[]>
      } else {
        this.games$ = collectionData(this.gamesCollection, {
          idField: "id",
        }) as Observable<GameInfo[]>
      }
    })

  }
}
