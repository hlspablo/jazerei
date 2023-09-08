import { match } from "ts-pattern"

export function translateConsole(value?: string | null): string {
  return match(value)
    .with("ps5", () => "Playstation 5")
    .with("ps4", () => "Playstation 4")
    .with("ps3", () => "Playstation 3")
    .with("xbox-one", () => "Xbox One")
    .with("xbox-360", () => "Xbox 360")
    .with("nintendo-switch", () => "Nintendo Switch")
    .with("nintendo-3ds", () => "Nintendo 3DS")
    .otherwise(() => "Unknown")
}
