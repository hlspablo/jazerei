import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "getFirstName",
})
export class GetFirstNamePipe implements PipeTransform {
  transform(value?: string | null): string {
    if (!value) return "Usuário"
    return value.split(" ").length > 0 ? value.split(" ")[0] : value
  }
}
