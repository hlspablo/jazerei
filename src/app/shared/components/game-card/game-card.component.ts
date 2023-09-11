import { Component, Input, OnChanges, SimpleChanges } from "@angular/core"
import { GameFirebaseRow } from "../../interfaces/app.interface"
import { Observable, map, of, tap } from "rxjs"

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.scss"],
})
export class GameCardComponent {
  @Input() game$: Observable<Partial<GameFirebaseRow>> = of({})

  gameCard$ = this.game$.pipe(
    map((game) => ({
      maxWidth: "350px",
      imagesUrls: ["https://placehold.co/600x400"],
      name: "Title",
      owner: " Owner",
      avatarUrl: "https://ui-avatars.com/api/?name=Owner",
      description: "Description",
      consoleModel: "Default Platform",
      ...game,
    })),
    tap((game) => console.log(game)),
  )

  @Input()
  previewMode = false
  @Input()
  imagePreview: string | ArrayBuffer | null = null

  // getAvatarUrl() {
  //   const gameOwner = this.defaultGameInfo.gameOwner || "User"
  //   return `https://ui-avatars.com/api/?name=${encodeURIComponent(gameOwner)}`
  // }
}
