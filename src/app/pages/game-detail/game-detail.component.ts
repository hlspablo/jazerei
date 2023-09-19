import { Component, OnInit, inject } from "@angular/core"
import { switchMap } from "rxjs"
import { ContatDialogComponent } from "src/app/shared/components/contact-dialog/contact-dialog.component"
import { MatDialog } from "@angular/material/dialog"
import { GameFirebaseRow } from "src/app/shared/interfaces/app.interface"
import { BreakpointService } from "src/app/services/breakpoint-service.service"
import { ActivatedRoute, Router } from "@angular/router"
import { RxState } from "@rx-angular/state"
import { GameRepository } from "src/app/repositories/game.repository"
import { AuthService } from "src/app/services/auth.service"
import { ToastrService } from "ngx-toastr"
import { Location } from "@angular/common"

interface GameDetailState {
  game: GameFirebaseRow
  photoIndex: number
  slideImageLoaded: boolean
  isHandsetOrSmall: boolean
}

@Component({
  selector: "app-game-detail",
  templateUrl: "./game-detail.component.html",
  styleUrls: ["./game-detail.component.scss"],
  providers: [RxState],
})
export class GameDetailPageComponent implements OnInit {
  private _routerService = inject(Router)
  private _location = inject(Location)
  private _activeRouterService = inject(ActivatedRoute)
  private _dialogService = inject(MatDialog)
  private _breakpointService = inject(BreakpointService)
  private _gameRepository = inject(GameRepository)
  private _authService = inject(AuthService)
  private _toastService = inject(ToastrService)
  //private _dialogService = inject(DialogService)

  protected currentSlideIndex = 0

  protected isHandsetOrSmall$ = this._state.select("isHandsetOrSmall")
  protected game$ = this._state.select("game")
  protected photoIndex$ = this._state.select("photoIndex")
  protected imageIsLoaded$ = this._state.select("slideImageLoaded")
  protected user$ = this._authService.getUser()

  deleteProgress = 0

  constructor(private _state: RxState<GameDetailState>) {
    this._state.set({
      photoIndex: 0,
      slideImageLoaded: false,
    })
  }

  onDeleteHold(progress: number) {
    this.deleteProgress = progress / 20
    if (this.deleteProgress > 100) {
      this._gameRepository.deleteGameById(this._state.get("game").id)
      this._toastService.success("Jogo deletado com sucesso!")
      this._routerService.navigate(["/my-games"])
    }
  }

  openTextMessageDialog() {
    this._dialogService.open(ContatDialogComponent, {
      data: this._state.get("game"),
      autoFocus: true,
      width: this._state.get("isHandsetOrSmall") ? "100%" : `calc(100% / 2.5)`,
      position: {
        top: "10vh",
      },
    })
  }

  showLoadedImage() {
    this._state.set("slideImageLoaded", (_) => true)
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
      this._activeRouterService.paramMap.pipe(
        switchMap((params) => {
          const gameId = params.get("id")!
          return this._gameRepository.getGameById(gameId)
        }),
      ),
    )

    this._state.connect("isHandsetOrSmall", this._breakpointService.isHandsetOrSmall())
  }
}
