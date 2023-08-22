import { Component } from "@angular/core"

@Component({
  selector: "app-sliding-menu",
  templateUrl: "./sliding-menu.component.html",
  styleUrls: ["./sliding-menu.component.scss"],
})
export class SlidingMenuComponent {
  menuOpen = false

  toggleMenu() {
    this.menuOpen = !this.menuOpen
  }

  closeMenu() {
    this.menuOpen = false
  }
}
