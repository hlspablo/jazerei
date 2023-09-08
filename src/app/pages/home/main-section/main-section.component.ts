import { Component, OnInit, inject } from "@angular/core"
import { Observable, combineLatest, switchMap } from "rxjs"
import { GameInfo } from "src/app/shared/interfaces/app.interface"
import { Firestore, collection, collectionData, query, where } from "@angular/fire/firestore"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { Auth, user } from "@angular/fire/auth"
import { ActivatedRoute } from "@angular/router"

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
  private auth = inject(Auth)
  private user$ = user(this.auth)
  private routes = inject(ActivatedRoute)
  private validConsoles = [
    "ps5",
    "ps4",
    "ps3",
    "xbox-one",
    "xbox-360",
    "nintendo-switch",
    "nintendo-3ds",
  ]

  ngOnInit() {
    // Combine latest values of user$ and city$ into one observable array [user, city]
    this.games$ = combineLatest([
      this.user$,
      this.locationService.city$,
      this.routes.paramMap,
    ]).pipe(
      switchMap(([user, city, params]) => {
        const queryConstraints = []

        // Apply location constraint if city exists
        if (city && city.id) {
          queryConstraints.push(where("location", "==", city.id))
        }

        // Apply user constraint if user exists
        if (user && user.uid) {
          queryConstraints.push(where("gameOwnerId", "!=", user.uid))
        }

        const myConsole = params.get("console")
        if (myConsole && this.validConsoles.includes(myConsole)) {
          console.log("ENTERED")
          queryConstraints.push(where("console", "==", myConsole))
        }

        // Create and return the new query
        const gamesQuery = query(this.gamesCollection, ...queryConstraints)
        return collectionData(gamesQuery, { idField: "id" }) as Observable<GameInfo[]>
      }),
    )
  }
}
