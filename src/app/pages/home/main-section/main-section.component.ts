import { Component, OnInit, inject } from "@angular/core"
import { Observable } from "rxjs"
import { GameInfo } from "src/app/shared/interfaces/app.interface"
import { Firestore, collection, collectionData } from "@angular/fire/firestore"

@Component({
  selector: "app-home-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class HomeMainSectionComponent implements OnInit {
  times = new Array(3).fill(0)
  private firestore = inject(Firestore)
  private gamesCollection = collection(this.firestore, "games")
  protected games$: Observable<GameInfo[]>
  //protected gameInfo: GameInfo[]

  updateGameInfo(gameInfo: GameInfo): void {
    console.log("Game info:", gameInfo)
  }

  ngOnInit() {
    this.games$ = collectionData(this.gamesCollection, {
      idField: "id",
    }) as Observable<GameInfo[]>

    // this.games$.subscribe((games) => {
    //   this.gameInfo = games
    // })
  }
}
