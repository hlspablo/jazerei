import { Component, Input, OnInit } from "@angular/core"

export interface GameCardInput {
  id: string
  name: string
  description: string
  owner: string
  ownerId: string
  imagesUrls: string[]
  consoleModel: string
}

type CardSizeType = "large" | "small"

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.scss"],
})
export class GameCardComponent implements OnInit {
  @Input() game: GameCardInput
  @Input()
  previewMode = false
  @Input()
  imagePreview: string | ArrayBuffer | null = null

  @Input()
  cardSize: CardSizeType = "small"

  protected avatarUrl: string

  formatCoverUrl(url: string): string {
    return url.replace("_950x600", "_330x330")
  }

  ngOnInit(): void {
    this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.game.owner)}`
  }
}
