import { Component, Input, OnChanges, SimpleChanges } from "@angular/core"
import { GameInfo } from "../../interfaces/app.interface"

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.scss"],
})
export class GameCardComponent implements OnChanges {
  @Input() gameInfo: Partial<GameInfo>

  protected defaultGameInfo = {
    maxWidth: "350px",
    imagesUrls: ["https://placehold.co/600x400"],
    gameName: "Default Game Title",
    gameOwner: "Default Game Owner",
    gameDescription: "Default Game Description",
    gamePlatform: "Default Platform",
  } satisfies GameInfo

  @Input()
  previewMode = false
  @Input()
  imageSourcePreview: string | ArrayBuffer | null = null

  getAvatarUrl() {
    const gameOwner = this.defaultGameInfo.gameOwner || "User"
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(gameOwner)}`
  }

  getMainImage() {
    return this.previewMode ? this.imageSourcePreview : this.defaultGameInfo.imagesUrls[0]
  }

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
