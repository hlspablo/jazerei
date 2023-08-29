import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "getFirstName",
})
export class GetFirstNamePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return ""
    return value.split(" ")[0]
  }
}
