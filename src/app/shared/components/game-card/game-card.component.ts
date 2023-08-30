import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from "@angular/core"
import { GameInfo } from "../../interfaces/game.interface"
import { AuthService } from "src/app/services/auth.service"
import { User } from "@angular/fire/auth"
import { match } from "ts-pattern"

@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.scss"],
})
export class GameCardComponent implements OnChanges, OnInit {
  @Input() gameInfo: Partial<GameInfo>

  private authService = inject(AuthService)
  protected currentUser: User | null

  protected defaultGameInfo = {
    maxWidth: "350px",
    imageSource: "https://placehold.co/600x400",
    gameTitle: "Default Game Title",
    gameDescription: "Default Game Description",
    gamePlatform: "Default Platform",
  }
  avatarUrl = "https://ui-avatars.com/api/?name=User"

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
          gamePlatform: translatePlatform(
            gameInfoChange.currentValue.gamePlatform,
          ),
        }
      }
    }
  }

  updateAvatarUrl(displayName: string): void {
    console.log("Called updateAvatarUrl")
    const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}`
    this.avatarUrl = newAvatarUrl
    console.log(this.avatarUrl)
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCachedUser()
    this.updateAvatarUrl(getFirstTwoNames(this.currentUser?.displayName) || "")
    this.authService.user$.subscribe((user) => {
      this.currentUser = user
      this.updateAvatarUrl(getFirstTwoNames(user?.displayName) || "")
    })
  }
}

function translatePlatform(value: string): string {
  return match(value)
    .with("ps5", () => "PS5")
    .with("ps4", () => "PS4")
    .with("ps3", () => "PS3")
    .with("xbox-one", () => "Xbox One")
    .with("xbox-360", () => "Xbox 360")
    .with("nintendo-switch", () => "Nintendo Switch")
    .with("nintendo-3ds", () => "Nintendo 3DS")
    .otherwise(() => "Unknown")
}

function getFirstTwoNames(input?: string | null): string {
  if (!input) return "Usuário"
  // Remove leading and trailing spaces and then split the string by one or more spaces
  const names = input.trim().split(/\s+/)
  // Get the first two names and join them back into a string
  const firstTwoNames = names.slice(0, 2).join(" ")
  return firstTwoNames
}
