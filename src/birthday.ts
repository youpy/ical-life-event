export type Gender = "m" | "f";
export interface IBirthDay {
  readonly day: string;
  readonly name: string;
  readonly gender: Gender;
}
