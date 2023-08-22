import { Component, OnInit } from "@angular/core"
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout"
import { Observable, map } from "rxjs"

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.scss"],
})
export class MainNavComponent implements OnInit {
  showHamburgerMenu: Observable<boolean>

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.showHamburgerMenu = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small])
      .pipe(map((result) => result.matches))
  }
}
