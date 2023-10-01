import { Injectable, inject } from "@angular/core"
import { AuthService } from "./auth.service"
import { RatingRepository } from "../repositories/rating.repository"
import { Rating } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class RatingService {
  private _ratingRepository = inject(RatingRepository)
  private _authService = inject(AuthService)

  async getUserRate(profileId: string) {
    const items = await this._ratingRepository.getRatingsItems(profileId)
    return this.calculateMeanFromItems(items)
  }

  async setUserRate(profileId: string, rating: number) {
    const currentUser = this._authService.getCurrentUserOrThrow()
    await this._ratingRepository.setRating(profileId, currentUser.uid, rating)
  }

  async getMyRate(profileId: string, currentUserId: string) {
    const rate = await this._ratingRepository.getRating(profileId, currentUserId)
    return rate?.rating || 0
  }

  async calculateMeanFromItems(items: Rating[]) {
    const sum = items.reduce((acc, item) => acc + item.rating, 0)
    return Math.ceil(sum / items.length)
  }
}
