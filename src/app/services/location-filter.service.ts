import { Injectable, Inject, PLATFORM_ID } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { BehaviorSubject } from "rxjs"
import { MyLocation } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class LocationFilterService {
  private citySubject = new BehaviorSubject<MyLocation | null>(null)
  city$ = this.citySubject.asObservable()

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.setInitialValue()
  }

  private setInitialValue() {
    if (isPlatformBrowser(this.platformId)) {
      const initialValue = localStorage.getItem("city")
      const initialValueObject = initialValue ? JSON.parse(initialValue) : null
      this.citySubject.next(initialValueObject as MyLocation)

      this.citySubject.subscribe((city) => {
        if (city !== null) {
          localStorage.setItem("city", JSON.stringify(city))
        } else {
          localStorage.removeItem("city")
        }
      })
    }
  }

  setCity(city: MyLocation | null) {
    this.citySubject.next(city)
  }

  getCity() {
    return this.citySubject.value
  }
}
