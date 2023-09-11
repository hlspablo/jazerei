import { Component, OnInit, inject } from "@angular/core"
import { Observable, combineLatest, switchMap, of, tap, map } from "rxjs"
import { GameFirebaseRow } from "src/app/shared/interfaces/app.interface"
import { Firestore, collection, collectionData, query, where } from "@angular/fire/firestore"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { Auth, user } from "@angular/fire/auth"
import { ActivatedRoute } from "@angular/router"
import { translateConsole } from "src/app/utils/game.translate"
import { SearchFilterService } from "src/app/services/search-filter.service"
import { removeDiacritics } from "src/app/utils/string.utils"
import { GameCardInput } from "src/app/shared/components/game-card/game-card.component"

@Component({
  selector: "app-home-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class HomeMainSectionComponent implements OnInit {
  private firestore = inject(Firestore)
  private gamesCollection = collection(this.firestore, "games")
  protected games$: Observable<GameCardInput[]>
  private locationService = inject(LocationFilterService)
  private searchFilterService = inject(SearchFilterService)
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
  protected currentConsole: string | null

  ngOnInit() {
    this.games$ = combineLatest([
      this.user$,
      this.locationService.city$,
      this.routes.paramMap,
      this.searchFilterService.searchQuery$,
    ]).pipe(
      switchMap(([user, city, params, searchQuery]) => {
        const queryConstraints = []

        // Apply location constraint if city exists
        if (city && city.id) {
          queryConstraints.push(where("location", "==", city.id))
        }

        const filter = params.get("filter")
        if (filter === "all" && user && user.uid) {
          queryConstraints.push(where("ownerId", "==", user.uid))
        }

        // Apply user constraint if user exists
        if (user && user.uid && !filter) {
          queryConstraints.push(where("ownerId", "!=", user.uid))
        }

        const myConsole = params.get("console")
        this.currentConsole = myConsole ? translateConsole(myConsole) : "Todos os Jogos"
        if (myConsole && this.validConsoles.includes(myConsole)) {
          queryConstraints.push(where("consoleModel", "==", myConsole))
        }

        if (searchQuery) {
          const searchQueryNoDiacritics = removeDiacritics(searchQuery).toLowerCase()
          queryConstraints.push(
            where("name_lowercase", ">=", searchQueryNoDiacritics),
            where("name_lowercase", "<=", searchQueryNoDiacritics + "\uf8ff"),
          )
        }

        // Create and return the new query
        const gamesQuery = query(this.gamesCollection, ...queryConstraints)
        console.log("[Constraits]", queryConstraints)
        return collectionData(gamesQuery, { idField: "id" }) as Observable<GameFirebaseRow[]>
      }),
      map((games) => games.map((game) => ({ ...game }))),
      tap((games) => console.log(games)),
    )
  }
}
