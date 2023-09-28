import { Component, Input, OnInit } from "@angular/core"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfilePageComponent implements OnInit {
  @Input() id: string

  stars: string[] = []
  selectedRating = 0

  fillStars(starCount: number) {
    this.stars = Array(5)
      .fill("star_border")
      .map((_, index) => (index < starCount ? "star" : "star_border"))
  }

  setRating(rating: number) {
    this.selectedRating = rating
    this.fillStars(rating)
  }

  ngOnInit() {
    this.fillStars(this.selectedRating)
  }
}
