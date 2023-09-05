import { match } from "ts-pattern"

export function switchValue(X: number): number {
  return match(X)
    .with(0, () => 1)
    .with(1, () => 0)
    .otherwise(() => {
      throw new Error("X must be 0 or 1")
    })
}
