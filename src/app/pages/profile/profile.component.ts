import { Component, Input, OnInit } from "@angular/core"
import { RxState } from "@rx-angular/state"

//interface State {}

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  providers: [RxState],
})
export class ProfilePageComponent implements OnInit {
  @Input() id: string

  ngOnInit() {
    this.fillStars(0)
  }
  stars: string[] = []
  selectedRating = 0

  fillStars(starCount: number) {
    this.stars = Array(5)
      .fill("star_border")
      .map((_, index) => (index < starCount ? "star" : "star_border"))
    console.log(this.stars)
  }

  resetStars() {
    if (this.selectedRating === 0) {
      this.stars.fill("star_border")
    } else {
      this.fillStars(this.selectedRating)
    }
  }

  hoverStar(starCount: number) {
    this.fillStars(starCount)
  }

  setRating(rating: number) {
    this.hoverStar(rating)
  }
}
