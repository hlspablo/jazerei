import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
  name: "getFirstTwoNames",
})
export class GetFirstTwoNamesPipe implements PipeTransform {
  transform(input: string | null): string {
    if (!input) return "Usuário"
    const names = input.trim().split(/\s+/)
    const firstTwoNames = names.slice(0, 2).join(" ")
    return firstTwoNames
  }
}
