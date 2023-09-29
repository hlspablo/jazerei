import { Directive, HostListener, Output, EventEmitter } from "@angular/core"

@Directive({
  selector: "[appClickAndKey]",
})
export class ClickAndKeyDirective {
  @Output() appClickAndKey = new EventEmitter<void>()

  @HostListener("click")
  @HostListener("keydown.enter")
  @HostListener("keydown.space")
  handleClickAndKey() {
    this.appClickAndKey.emit()
  }
}
