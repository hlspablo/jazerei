import { Component, OnInit, inject } from "@angular/core"
import { Observable, switchMap } from "rxjs"
import { ContatDialogComponent } from "src/app/shared/components/contact-dialog/contact-dialog.component"
import { MatDialog } from "@angular/material/dialog"
import { GameFirebaseRow } from "src/app/shared/interfaces/app.interface"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { ActivatedRoute } from "@angular/router"
import { RxState } from "@rx-angular/state"
import { GameRepository } from "src/app/repositories/game.repository"

interface GameDetailState {
  game: GameFirebaseRow
  photoIndex: number
}

@Component({
  selector: "app-game-detail",
  templateUrl: "./game-detail.component.html",
  styleUrls: ["./game-detail.component.scss"],
  providers: [RxState],
})
export class GameDetailPageComponent implements OnInit {
  private _routesService = inject(ActivatedRoute)
  private _dialogService = inject(MatDialog)
  private _breakpointService = inject(BreakpointService)
  private _gameRepository = inject(GameRepository)

  protected currentSlideIndex = 0

  protected isHandsetOrSmall$: Observable<boolean>
  protected game$ = this._state.select("game")
  protected photoIndex$ = this._state.select("photoIndex")

  constructor(private _state: RxState<GameDetailState>) {
    this._state.set({
      photoIndex: 0,
    })
  }

  openTextMessageDialog() {
    this._dialogService.open(ContatDialogComponent, {
      data: this._state.get("game"),
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  prevImage() {
    this._state.set(
      "photoIndex",
      ({ game, photoIndex }) => (photoIndex - 1 + game.imagesUrls.length) % game.imagesUrls.length,
    )
  }
  nextImage() {
    this._state.set(
      "photoIndex",
      ({ game, photoIndex }) => (photoIndex + 1) % game.imagesUrls.length,
    )
  }
  goToImage(index: number) {
    this._state.set("photoIndex", (_) => index)
    this.currentSlideIndex = index
  }

  ngOnInit(): void {
    this._state.connect(
      "game",
      this._routesService.paramMap.pipe(
        switchMap((params) => {
          const gameId = params.get("id")!
          return this._gameRepository.getGameById(gameId)
        }),
      ),
    )

    this.isHandsetOrSmall$ = this._breakpointService.isHandsetOrSmall()
  }
}
