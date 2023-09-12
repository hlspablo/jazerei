import { match } from "ts-pattern"

/**
 * Returns the index of the other member in a two-member group.
 * @param {number} X - The index of the current member (0 or 1).
 * @returns {number} The index of the other member.
 * @throws {Error} X must be 0 or 1.
 */
export function switchMemberIndex(X: number): number {
  return match(X)
    .with(0, () => 1)
    .with(1, () => 0)
    .otherwise(() => {
      throw new Error("X must be 0 or 1")
    })
}
