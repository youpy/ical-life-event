export type Gender = "m" | "f";
export interface IBirthDay {
  get day(): string;
  get name(): string;
  get gender(): Gender;
}
