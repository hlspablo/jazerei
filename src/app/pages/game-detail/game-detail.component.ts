import { Component, OnInit, inject } from "@angular/core"
import { Firestore, doc, docData } from "@angular/fire/firestore"
import { ActivatedRoute } from "@angular/router"
import { Observable } from "rxjs"
import { GameFirebaseRow } from "src/app/shared/interfaces/app.interface"

@Component({
  selector: "app-game-detail",
  templateUrl: "./game-detail.component.html",
  styleUrls: ["./game-detail.component.scss"],
})
export class GameDetailPageComponent implements OnInit {
  private routes = inject(ActivatedRoute)
  private firestore = inject(Firestore)
  protected gameId: string

  game$: Observable<GameFirebaseRow>

  getGame() {
    const gameDoc = doc(this.firestore, "games", this.gameId)
    this.game$ = docData(gameDoc, {
      idField: "id",
    }) as Observable<GameFirebaseRow>
  }

  ngOnInit(): void {
    this.routes.paramMap.subscribe((params) => {
      this.gameId = params.get("id") || ""
      this.getGame()
    })
  }
}
