import { Component, Input } from "@angular/core"

@Component({
  selector: "app-progress-button",
  templateUrl: "./progress-button.component.html",
  styleUrls: ["./progress-button.component.scss"],
})
export class ProgressButtonComponent {
  @Input() progress: number = 0 // Between 0 and 100

  onClick() {
    // Implement your click action here
  }
}
