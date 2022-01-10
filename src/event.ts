import { Gender, IBirthDay } from "./birthday";
import { IEventPolicy } from "./event_policy";
import { Temporal } from "@js-temporal/polyfill";

export interface IEventApplication {
  date: Temporal.PlainDate;
  summary: string;
}

export class Event {
  readonly title: string;
  readonly gender: Gender | undefined;
  readonly policy: IEventPolicy;

  constructor(title: string, policy: IEventPolicy, gender?: Gender) {
    this.title = title;
    this.policy = policy;
    this.gender = gender;
  }

  apply(birthday: IBirthDay): IEventApplication | null {
    if (this.gender && this.gender !== birthday.gender) {
      return null;
    }

    const date = Temporal.PlainDate.from(birthday.day);
    const result = this.policy.apply(date);

    return {
      date: result,
      summary: this.summary(birthday.name),
    };
  }

  private summary(name: string): string {
    return [name, this.title].join(" ");
  }
}

export interface IEvent {
  apply(birthday: IBirthDay): IEventApplication | null;
}
