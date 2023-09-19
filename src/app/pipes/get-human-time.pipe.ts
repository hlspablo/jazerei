import { Pipe, PipeTransform } from "@angular/core"
import { Timestamp } from "firebase/firestore"
import { convertTimestampToTime } from "../utils/time.utils"

@Pipe({
  name: "getHumanTime",
})
export class GetHumanTimePipe implements PipeTransform {
  transform(value: Timestamp | null): string {
    if (!value) return ""
    return convertTimestampToTime(value)
  }
}
