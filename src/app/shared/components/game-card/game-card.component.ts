import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from "@angular/core"
import { GameFirebaseRow } from "../../interfaces/app.interface"
import { Observable, combineLatest, map, of, tap } from "rxjs"
import { AuthService } from "src/app/services/auth.service"
import { getFirstTwoNames } from "src/app/utils/string.utils"

interface GameCardPropsInterface {
  id: string
  name: string
  description: string
  owner: string
  ownerId: string
  imagesUrls: string[]
  consoleModel: string
  avatarUrl: string
  maxWidth: string
}
@Component({
  selector: "app-game-card",
  templateUrl: "./game-card.component.html",
  styleUrls: ["./game-card.component.scss"],
})
export class GameCardComponent implements OnInit {
  @Input() game$: Observable<Partial<GameFirebaseRow>>
  @Input()
  previewMode = false
  @Input()
  imagePreview: string | ArrayBuffer | null = null

  private _authService = inject(AuthService)
  protected gameCard$: Observable<GameCardPropsInterface>

  async ngOnInit(): Promise<void> {
    const user = await this._authService.getCurrentUserSnapshot()
    this.gameCard$ = this.game$.pipe(
      map((game) => ({
        id: "default_id",
        ownerId: "default_owner_id",
        owner: getFirstTwoNames(user?.displayName) ?? "Owner",
        maxWidth: "350px",
        imagesUrls: ["https://placehold.co/600x400"],
        name: "Title",
        avatarUrl: "https://ui-avatars.com/api/?name=Owner",
        description: "Description",
        consoleModel: "ConsoleModel",
        ...game,
      })),
    )
  }
}
