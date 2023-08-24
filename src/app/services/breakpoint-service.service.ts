import { Injectable } from "@angular/core"
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class BreakpointService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isHandsetOrSmall(): Observable<boolean> {
    return this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small])
      .pipe(map((result) => result.matches))
  }
}
