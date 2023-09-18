import { Component, HostListener, OnInit, inject } from "@angular/core"
import { BehaviorSubject, combineLatest, from, scan, switchMap } from "rxjs"
import { where } from "@angular/fire/firestore"
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

interface State {
  games: GameCardInput[]
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
  protected games$ = this._state.select("games")
  seeMoreClicks$ = new BehaviorSubject<void>(undefined)

  constructor(private _state: RxState<State>) {}

  @HostListener("window:scroll", ["$event"])
  onScroll(event: Event): void {
    if (window.innerWidth <= 768) {
      // 768px is a common breakpoint for mobile screens
      const pos =
        (document.documentElement.scrollTop || document.body.scrollTop) +
        document.documentElement.offsetHeight
      const max = document.documentElement.scrollHeight

      if (pos >= max) {
        this.seeMoreClicks$.next()
      }
    }
  }

  ngOnInit() {
    this._state.connect(
      "games",
      combineLatest([
        this._authService.getUser(),
        this._locationService.city$,
        this._routes.paramMap,
        this.seeMoreClicks$,
      ]).pipe(
        switchMap(([user, city, params]) => {
          return from(
            (async () => {
              const games = this._state.get("games")
              let lastGameSnapshot = null
              if (games && games.length > 0) {
                const lastGame = games[games.length - 1]
                lastGameSnapshot = await this._gameRepository.getGameSnapshot(lastGame.id)
              }

              const queryConstraints = []
              const filters = []

              if (city && city.id) {
                queryConstraints.push(where("location", "==", city.id))
                filters.push(city.name)
              }

              if (user && user.uid) {
                queryConstraints.push(where("ownerId", "!=", user.uid))
              }

              const selectedConsole = params.get("console")
              if (selectedConsole && validConsoles.includes(selectedConsole)) {
                queryConstraints.push(where("consoleModel", "==", selectedConsole))
                filters.push(translateConsole(selectedConsole))
              }

              this.filtersApplied = filters.length > 0 ? filters.join(" | ") : "Todos os Jogos"

              return this._gameRepository.getGamesWithLimit(queryConstraints, lastGameSnapshot)
            })(),
          ).pipe(switchMap((innerObs) => innerObs))
        }),
        scan((acc: GameFirebaseRow[], newGames) => [...acc, ...newGames], []),
      ),
    )
  }
}
