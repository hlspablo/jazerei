import { Pipe, PipeTransform } from "@angular/core"
import { translateConsole } from "../utils/game.translate"

@Pipe({
  name: "translateConsolePipe",
})
export class TranslateConsolePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return ""
    return translateConsole(value)
  }
}
