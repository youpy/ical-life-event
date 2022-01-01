import ical, { ICalCalendar } from "ical-generator";
import { IBirthDay } from "./birthday";
import { IEvent } from "./event";
import moment from "moment";

export class Schedule {
  private birthday: IBirthDay;
  private calendar: ICalCalendar;

  constructor(birthday: IBirthDay) {
    this.birthday = birthday;
    this.calendar = ical({ name: "schedule for " + birthday.name });
  }

  add(event: IEvent) {
    if (event.gender && event.gender !== this.birthday.gender) {
      return;
    }

    const mBirthday = moment(this.birthday.day);
    const m = mBirthday
      .clone()
      .add(event.days, "days")
      .add(event.months, "months")
      .add(event.years, "years");

    if (event.full && mBirthday.month() >= 3) {
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
      allDay: true,
      start: m.calendar(),
      summary: event.summary(this.birthday.name),
    });
  }

  toString(): string {
    return this.calendar.toString();
  }
}
