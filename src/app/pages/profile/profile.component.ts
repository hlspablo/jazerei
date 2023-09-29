import { Component, Input, OnInit, inject } from "@angular/core"
import { RxEffects } from "@rx-angular/state/effects"
import { UserRepository } from "src/app/repositories/user.repository"
import { AuthService } from "src/app/services/auth.service"
import { RatingService } from "src/app/services/rating.service"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  providers: [RxEffects],
})
export class ProfilePageComponent implements OnInit {
  @Input() id: string

  private _authService = inject(AuthService)
  private _userRepository = inject(UserRepository)
  protected user$ = this._authService.getUser()
  private _ratingService = inject(RatingService)

  stars: string[] = []
  selectedRating = 0
  currentReputation = 0
  locationName = ""
  profileName = ""
  loadingData = false

  constructor(private _effects: RxEffects) {}

  fillStars(starCount: number) {
    this.stars = Array(5)
      .fill("star_border")
      .map((_, index) => (index < starCount ? "star" : "star_border"))
  }

  setRating(rating: number) {
    this.selectedRating = rating
    this.fillStars(rating)
    this._ratingService.setUserRate(this.id, rating)
  }

  async ngOnInit() {
    this.fillStars(this.selectedRating)
    this.currentReputation = await this._ratingService.getUserRate(this.id)
    const profile = await this._userRepository.getProfile(this.id)
    this.locationName = profile.locationName
    this.profileName = profile.name

    this._effects.register(this.user$, async (user) => {
      if (!user) return
      this.selectedRating = await this._ratingService.getMyRate(this.id, user.uid)
      this.fillStars(this.selectedRating)
    })
  }
}
