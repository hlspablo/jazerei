import { Injectable, inject } from "@angular/core"
import {
  Firestore,
  QueryFieldFilterConstraint,
  collection,
  collectionData,
  query,
} from "@angular/fire/firestore"
import { Observable } from "rxjs"
import { MyLocation } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class LocationRepository {
  private _firestore = inject(Firestore)
  private _collection = collection(this._firestore, "locations")

  getLocationsFilter(queryConstraints: QueryFieldFilterConstraint[]) {
    const locationQuery = query(this._collection, ...queryConstraints)
    return collectionData(locationQuery, { idField: "id" }) as Observable<MyLocation[]>
  }
}
