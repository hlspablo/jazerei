import { Component, OnInit, inject } from "@angular/core"
import { Observable, combineLatest, firstValueFrom, switchMap } from "rxjs"
import { GameInfo } from "src/app/shared/interfaces/app.interface"
import { Firestore, collection, collectionData, query, where } from "@angular/fire/firestore"
import { LocationFilterService } from "src/app/services/location-filter.service"
import { Auth, user } from "@angular/fire/auth"

@Component({
  selector: "app-home-main-section",
  templateUrl: "./main-section.component.html",
  styleUrls: ["./main-section.component.scss"],
})
export class HomeMainSectionComponent implements OnInit {
  private firestore = inject(Firestore)
  private gamesCollection = collection(this.firestore, "games")
  protected games$: Observable<GameInfo[]>
  private locationService = inject(LocationFilterService)
  private auth = inject(Auth)
  private user$ = user(this.auth)


  ngOnInit() {
    // Combine latest values of user$ and city$ into one observable array [user, city]
    this.games$ = combineLatest([this.user$, this.locationService.city$])
      .pipe(
        switchMap(([user, city]) => {
          let queryConstraints = [];

          // Apply location constraint if city exists
          if (city && city.id) {
            queryConstraints.push(where("location", "==", city.id));
          }

          // Apply user constraint if user exists
          if (user && user.uid) {
            queryConstraints.push(where("gameOwnerId", "!=", user.uid));
          }

          // Create and return the new query
          const gamesQuery = query(this.gamesCollection, ...queryConstraints);
          return collectionData(gamesQuery, { idField: "id" }) as Observable<GameInfo[]>;
        })
      )

      }
  // ngOnInit() {
  //   this.games$ = collectionData(this.gamesCollection, {
  //     idField: "id",
  //   }) as Observable<GameInfo[]>

  //   this.user$.subscribe((user) => {
  //     let queryConstraints = [];
  //     if(this.currentCityId) {
  //       queryConstraints.push(where("location", "==", this.currentCityId))
  //     }
  //     if(user){
  //       this.currentUserId = user.uid
  //       queryConstraints.push(where("gameOwnerId" , "!=" , user.uid))
  //     }
  //     const gamesQuery = query(this.gamesCollection, ...queryConstraints)
  //     this.games$ = collectionData(gamesQuery, { idField: "id" }) as Observable<GameInfo[]>
  //   })

  //   this.locationService.city$.subscribe((city) => {
  //     let queryConstraints = [];
  //     if(city) {
  //       this.currentCityId = city.id
  //       queryConstraints.push(where("location", "==", city.id))
  //     }
  //     if(this.currentUserId){
  //       queryConstraints.push(where("gameOwnerId" , "!=" , this.currentUserId))
  //     }
  //     const gamesQuery = query(this.gamesCollection, ...queryConstraints)
  //     this.games$ = collectionData(gamesQuery, { idField: "id" }) as Observable<GameInfo[]>
  //   })
  // }
}
