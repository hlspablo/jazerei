import { Component } from "@angular/core"

@Component({
  selector: "app-home-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class HomeMainSectionComponent {
  times = new Array(3).fill(0)
}
