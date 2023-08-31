import { Component, Input, OnChanges, SimpleChanges } from "@angular/core"
import { GameInfo } from "../../interfaces/game.interface"

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.scss"],
})
export class GameCardComponent implements OnChanges {
  @Input() gameInfo: Partial<GameInfo>

  protected defaultGameInfo = {
    maxWidth: "350px",
    imageSource: "https://placehold.co/600x400",
    gameTitle: "Default Game Title",
    gameOwner: "Default Game Owner",
    gameDescription: "Default Game Description",
    gamePlatform: "Default Platform",
    avatarUrl: "https://ui-avatars.com/api/?name=User",
  }

  @Input()
  previewMode = false
  @Input()
  imageSourcePreview: string | ArrayBuffer | null = null

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Called ngOnChanges")
    if ("gameInfo" in changes) {
      const gameInfoChange = changes["gameInfo"]
      if (gameInfoChange && gameInfoChange.currentValue) {
        this.defaultGameInfo = {
          ...this.defaultGameInfo,
          ...gameInfoChange.currentValue,
        }
      }
    }
  }
}
