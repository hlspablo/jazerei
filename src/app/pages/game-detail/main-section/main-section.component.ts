import { Component } from "@angular/core"

@Component({
  selector: "app-game-detail-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class MainSectionComponent {
  times = new Array(3).fill(0)
}
