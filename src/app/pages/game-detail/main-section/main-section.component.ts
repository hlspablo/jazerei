import { Component, Input, OnInit } from "@angular/core"
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout"
import { Observable, map } from "rxjs"
import { TextMessageDialogComponent } from "src/app/shared/components/text-message-dialog/text-message-dialog.component"
import { MatDialog } from "@angular/material/dialog"

@Component({
  selector: "app-game-detail-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent implements OnInit {
  @Input()
  game_id: string

  images = [
    "https://placekitten.com/800/550",
    "https://placekitten.com/800/551",
    "https://placekitten.com/800/552",
  ]
  currentIndex = 0
  cardMaxWidth$: Observable<string>
  imageMaxHeight$: Observable<string>

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
  ) {}

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
    this.cardMaxWidth$ = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .pipe(
        map((result) => {
          if (result.breakpoints[Breakpoints.Handset]) {
            return "400px"
          } else if (result.breakpoints[Breakpoints.Tablet]) {
            return "600px"
          } else {
            return "800px"
          }
        }),
      )

    this.imageMaxHeight$ = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
      .pipe(
        map((result) => {
          if (result.breakpoints[Breakpoints.Handset]) {
            return "auto"
          } else if (result.breakpoints[Breakpoints.Tablet]) {
            return "600px"
          } else {
            return "800px"
          }
        }),
      )
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length
  }

  goToImage(index: number) {
    this.currentIndex = index
  }
}
