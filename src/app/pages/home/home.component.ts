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
import { AuthService } from "src/app/services/auth.service"
import { GameRepository } from "src/app/repositories/game.repository"

const validConsoles = [
  "ps5",
  "ps4",
  "ps3",
  "xbox-one",
  "xbox-360",
  "nintendo-switch",
  "nintendo-3ds",
]

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomePageComponent implements OnInit {
  private _locationService = inject(LocationFilterService)
  private _searchFilterService = inject(SearchFilterService)
  private _authService = inject(AuthService)
  private _routes = inject(ActivatedRoute)
  private _gameRepository = inject(GameRepository)

  protected filtersApplied: string
  protected games$: Observable<GameCardInput[]>

  ngOnInit() {
    this.games$ = combineLatest([
      this._authService.getUser(),
      this._locationService.city$,
      this._routes.paramMap,
      this._searchFilterService.searchQuery$,
    ]).pipe(
      switchMap(([user, city, params, searchQuery]) => {
        const queryConstraints = []
        const filters = []
        if (city && city.id) {
          queryConstraints.push(where("location", "==", city.id))
          filters.push(city.name)
        }

        const filter = params.get("filter")
        if (filter === "all" && user && user.uid) {
          queryConstraints.push(where("ownerId", "==", user.uid))
        }

        if (user && user.uid && !filter) {
          queryConstraints.push(where("ownerId", "!=", user.uid))
        }

        const selectedConsole = params.get("console")
        if (selectedConsole && validConsoles.includes(selectedConsole)) {
          queryConstraints.push(where("consoleModel", "==", selectedConsole))
          filters.push(translateConsole(selectedConsole))
        }

        if (searchQuery) {
          const searchQueryNoDiacritics = removeDiacritics(searchQuery).toLowerCase()
          queryConstraints.push(
            where("name_lowercase", ">=", searchQueryNoDiacritics),
            where("name_lowercase", "<=", searchQueryNoDiacritics + "\uf8ff"),
          )
          filters.push(`Palavra chave: ${searchQuery}`)
        }

        this.filtersApplied = filters.length > 0 ? filters.join(" | ") : "Todos os Jogos"

        return this._gameRepository.getGamesFilter(queryConstraints)
      }),
    )
  }
}
