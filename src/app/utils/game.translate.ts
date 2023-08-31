import { match } from "ts-pattern"

export function translatePlatform(value?: string | null): string {
  return match(value)
    .with("ps5", () => "PS5")
    .with("ps4", () => "PS4")
    .with("ps3", () => "PS3")
    .with("xbox-one", () => "Xbox One")
    .with("xbox-360", () => "Xbox 360")
    .with("nintendo-switch", () => "Nintendo Switch")
    .with("nintendo-3ds", () => "Nintendo 3DS")
    .otherwise(() => "Unknown")
}
