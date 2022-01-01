import moment from "moment";
import { Gender, IBirthDay } from "./birthday";

export interface IEventApplication {
  tz: string;
  date: string;
  summary: string;
}

export class Event {
  readonly years: number;
  readonly months: number;
  readonly days: number;
  readonly month: number | null;
  readonly day: number | null;
  readonly full: boolean;
  readonly title: string;
  readonly gender: Gender | undefined;

  constructor(
    years: number,
    months: number,
    days: number,
    month: number | null,
    day: number | null,
    full: boolean,
    title: string,
    gender?: Gender
  ) {
    this.years = years;
    this.months = months;
    this.days = days;
    this.month = month;
    this.day = day;
    this.full = full;
    this.title = title;
    this.gender = gender;
  }

  apply(birthday: IBirthDay): IEventApplication | null {
    if (this.gender && this.gender !== birthday.gender) {
      return null;
    }

    const mBirthday = moment(birthday.day);
    const m = mBirthday
      .clone()
      .add(this.days, "days")
      .add(this.months, "months")
      .add(this.years, "years");

    if (this.full && mBirthday.month() >= 3) {
      m.add(1, "years");
    }

    if (this.month !== null) {
      m.month(this.month);
    }

    if (this.day !== null) {
      m.date(this.day + 1);
    }

    return {
      date: m.calendar(),
      tz: m.format("Z"),
      summary: this.summary(birthday.name),
    };
  }

  private summary(name: string): string {
    return [name, this.title].join(" ");
  }
}

export interface IEvent {
  apply(birthday: IBirthDay): IEventApplication | null;
  get years(): number;
  get months(): number;
  get days(): number;
  get month(): number | null;
  get day(): number | null;
  get full(): boolean;
  get gender(): Gender | undefined;
}
