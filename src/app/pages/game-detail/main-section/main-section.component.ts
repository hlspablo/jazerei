import { Component, Input, OnInit, inject } from "@angular/core"
import { Observable, map } from "rxjs"
import { TextMessageDialogComponent } from "src/app/shared/components/text-message-dialog/text-message-dialog.component"
import { MatDialog } from "@angular/material/dialog"
import { GameInfo } from "src/app/shared/interfaces/app.interface"
import { BreakpointService } from "src/app/services/breakpoint-service.service"

@Component({
  selector: "app-game-detail-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  private breakpointService = inject(BreakpointService)
  private dialog = inject(MatDialog)
  isMobile$: Observable<boolean>

  @Input()
  game$: Observable<GameInfo>
  game: GameInfo

  currentIndex = 0
  cardMaxWidth$: Observable<string>
  imageMaxHeight$: Observable<string>


  openTextMessageDialog() {
    console.log("Open Dialog")
    this.dialog.open(TextMessageDialogComponent, {
      autoFocus: true,
      position: {
        top: "10vh",
      },
    })
  }

  ngOnInit(): void {
    this.game$.subscribe((game) => {
      this.game = game
    })
    this.isMobile$ = this.breakpointService.isHandsetOrSmall()
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.game.imagesUrls.length) % this.game.imagesUrls.length
  }
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.game.imagesUrls.length
  }
  goToImage(index: number) {
    this.currentIndex = index
  }
}
