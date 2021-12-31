import ical, { ICalCalendar } from "ical-generator";
import { BirthDay } from "./birthday";
import { Event } from "./event";
import moment from "moment";

export class Schedule {
  private birthday: BirthDay;
  private calendar: ICalCalendar;

  constructor(birthday: BirthDay) {
    this.birthday = birthday;
    this.calendar = ical({ name: "schedule for " + birthday.name });
  }

  add(event: Event) {
    let m = moment(this.birthday.day)
      .clone()
      .add(event.days, "days")
      .add(event.months, "months")
      .add(event.years, "years");

    if (event.full && m.month() >= 3) {
      m.add(1, "years");
    }

    if (event.month !== null) {
      m.month(event.month);
    }

    if (event.day !== null) {
      m.date(event.day + 1);
    }

    this.calendar.timezone(m.format("Z"));
    this.calendar.createEvent({
      start: m.calendar(),
      summary: event.summary(this.birthday.name),
    });
  }

  toString(): string {
    return this.calendar.toString();
  }
}
