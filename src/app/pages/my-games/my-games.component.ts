import { Component, OnInit, inject } from "@angular/core"
import { where } from "@angular/fire/firestore"
import { GameCardInput } from "src/app/shared/components/game-card/game-card.component"
import { AuthService } from "src/app/services/auth.service"
import { GameRepository } from "src/app/repositories/game.repository"
import { RxState } from "@rx-angular/state"

interface State {
  games: GameCardInput[]
}

@Component({
  selector: "app-my-games",
  templateUrl: "./my-games.component.html",
  styleUrls: ["./my-games.component.scss"],
  providers: [RxState],
})
export class MyGamesPageComponent implements OnInit {
  private _authService = inject(AuthService)
  private _gameRepository = inject(GameRepository)

  protected games$ = this._state.select("games")

  constructor(private _state: RxState<State>) {}

  ngOnInit() {
    const filter = [where("ownerId", "==", this._authService.getCurrentUserOrThrow().uid)]
    this._state.connect("games", this._gameRepository.getGamesFilter(filter))
  }
}
