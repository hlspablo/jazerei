import { Directive, EventEmitter, HostListener, Output } from "@angular/core"
import { Observable, Subject, filter, interval, map, take, takeUntil, tap } from "rxjs"

@Directive({
  selector: "[holdable]",
})
export class HoldableDirective {
  @Output() holdTime: EventEmitter<number> = new EventEmitter()

  protected state = new Subject<string>()
  protected cancel: Observable<string>

  constructor() {
    this.cancel = this.state.pipe(
      filter((v) => v === "cancel"),
      tap(() => {
        this.holdTime.emit(0)
      }),
    )
  }

  @HostListener("mouseup", ["$event"])
  @HostListener("mouseleave", ["$event"])
  OnExit() {
    this.state.next("cancel")
  }

  @HostListener("mousedown", ["$event"])
  OnHold() {
    this.state.next("start")
    const n = 100
    interval(n)
      .pipe(
        takeUntil(this.cancel),
        tap((v) => this.holdTime.emit(v * n)),
      )
      .subscribe()
  }
}
