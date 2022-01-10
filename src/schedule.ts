import ical, { ICalCalendar } from "ical-generator";
import { IBirthDay } from "./birthday";
import { IEvent } from "./event";

export class Schedule {
  private birthday: IBirthDay;
  private calendar: ICalCalendar;

  constructor(birthday: IBirthDay) {
    this.birthday = birthday;
    this.calendar = ical({ name: "schedule for " + birthday.name });
  }

  add(event: IEvent) {
    const res = event.apply(this.birthday);
    if (res === null) {
      return;
    }

    this.calendar.createEvent({
      allDay: true,
      start: res.date.toString(),
      summary: res.summary,
    });
  }

  toString(): string {
    return this.calendar.toString();
  }
}
