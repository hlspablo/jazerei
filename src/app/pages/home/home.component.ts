import { Component, HostListener, OnInit, inject } from "@angular/core"
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  concatMap,
  from,
  mergeAll,
  scan,
  switchMap,
  tap,
} from "rxjs"
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryFieldFilterConstraint,
  where,
} from "@angular/fire/firestore"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { ActivatedRoute } from "@angular/router"
import { translateConsole } from "src/app/utils/game.translate"
import { SearchFilterService } from "src/app/services/search-filter.service"
import { GameCardInput } from "src/app/shared/components/game-card/game-card.component"
import { AuthService } from "src/app/services/auth.service"
import { GameRepository } from "src/app/repositories/game.repository"
import { validConsoles } from "src/app/shared/interfaces/app.arrays"
import { RxState } from "@rx-angular/state"
import { GameFirebaseRow } from "src/app/shared/interfaces/app.interface"
import { removeDiacritics } from "src/app/utils/string.utils"

interface State {
  games: GameFirebaseRow[]
}
interface QueryConstraints {
  locations: QueryFieldFilterConstraint[]
  consoles: QueryFieldFilterConstraint[]
  users: QueryFieldFilterConstraint[]
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [RxState],
})
export class HomePageComponent implements OnInit {
  private _locationService = inject(LocationFilterService)
  private _searchFilterService = inject(SearchFilterService)
  private _authService = inject(AuthService)
  private _routes = inject(ActivatedRoute)
  private _gameRepository = inject(GameRepository)

  protected filtersApplied: string
  games$ = this._state.select("games")
  seeMoreClicks$ = new Subject<void>()
  loadingMore = false

  protected queryConstraints: QueryConstraints = {
    locations: [],
    consoles: [],
    users: [],
  }
  protected filters: string[] = []
  protected searchWord: string
  protected latestGameSnapshot: DocumentSnapshot<DocumentData>

  constructor(private _state: RxState<State>) {}

  getQueryConstrainsAsArray() {
    return Object.values(this.queryConstraints).flat() as QueryFieldFilterConstraint[]
  }

  async getLatestSnapshot() {
    const games = this._state.get("games")
    if (games && games.length > 0) {
      const lastGame = games[games.length - 1]
      console.log("Getting latest snapshot", lastGame.id)
      this.latestGameSnapshot = await this._gameRepository.getGameSnapshot(lastGame.id)
    }
  }

  ngOnInit() {
    this._state.hold(
      this.seeMoreClicks$.pipe(
        tap(() => console.log("See more clicked")),
        concatMap(async () => {
          this.loadingMore = true
          await this.getLatestSnapshot()
          return this._gameRepository.getGamesStartAfter(
            this.getQueryConstrainsAsArray(),
            this.latestGameSnapshot,
          )
        }),
        switchMap((games) => games),
        tap((newGames) => {
          const stateGames = this._state.get("games")
          const games = [...stateGames, ...newGames]
          this._state.set("games", (_) => games)
          this.loadingMore = false
        }),
      ),
    )

    this._state.connect(
      "games",
      this._searchFilterService.searchQuery$.pipe(
        switchMap((searchQuery) => {
          if (searchQuery) {
            this.searchWord = searchQuery
            const searchQueryNoDiacritics = removeDiacritics(searchQuery).toLowerCase()
            return this._gameRepository.getGamesSearch([
              where("name_lowercase", ">=", searchQueryNoDiacritics),
              where("name_lowercase", "<=", searchQueryNoDiacritics + "\uf8ff"),
            ])
          } else {
            return this._gameRepository.getGamesOrderBy(this.getQueryConstrainsAsArray())
          }
        }),
      ),
    )

    this._state.connect(
      "games",
      combineLatest([
        this._authService.getUser(),
        this._locationService.city$,
        this._routes.paramMap,
      ]).pipe(
        switchMap(([user, city, params]) => {
          this.filters = []
          if (city && city.id) {
            this.queryConstraints.locations = []
            this.queryConstraints.locations.push(where("location", "==", city.id))
            this.filters.push(city.name)
          } else {
            this.queryConstraints.locations = []
          }

          const selectedConsole = params.get("console")
          if (selectedConsole && validConsoles.includes(selectedConsole)) {
            this.queryConstraints.consoles = []
            this.queryConstraints.consoles.push(where("consoleModel", "==", selectedConsole))
            this.filters.push(translateConsole(selectedConsole))
          }

          return this._gameRepository.getGamesOrderBy(this.getQueryConstrainsAsArray())
        }),
      ),
    )
  }
}
