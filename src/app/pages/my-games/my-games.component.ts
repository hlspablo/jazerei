import { Component, OnInit, inject } from "@angular/core"
import { where } from "@angular/fire/firestore"
import { GameCardInput } from "src/app/shared/components/game-card/game-card.component"
import { AuthService } from "src/app/services/auth.service"
import { GameRepository } from "src/app/repositories/game.repository"
import { RxState } from "@rx-angular/state"
import { RxEffects } from "@rx-angular/state/effects"

interface State {
  games: GameCardInput[]
}

@Component({
  selector: "app-my-games",
  templateUrl: "./my-games.component.html",
  styleUrls: ["./my-games.component.scss"],
  providers: [RxState, RxEffects],
})
export class MyGamesPageComponent {
  private _authService = inject(AuthService)
  private _gameRepository = inject(GameRepository)

  protected games$ = this._state.select("games")
  protected user$ = this._authService.getUser()

  constructor(
    private _state: RxState<State>,
    private _effects: RxEffects,
  ) {
    this._effects.register(this.user$, async (user) => {
      if(!user) return
      const filter = [where("ownerId", "==", user.uid)]
      this._state.connect("games", this._gameRepository.getGamesOrderBy(filter))
    })
  }
}
