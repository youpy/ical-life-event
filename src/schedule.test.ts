import {
  RelativeEventPolicy,
  CompositeEventPolicy,
  AbsoluteEventPolicy,
  JapaneseSchoolEventPolicy,
} from "./event_policy";
import { Event } from "./event";
import { Schedule } from "./schedule";
import ical from "ical";
import { Gender } from "./birthday";

const extractEvents = (icalData: string): ical.CalendarComponent[] => {
  const icalEvents: ical.CalendarComponent[] = [];
  const data = ical.parseICS(icalData);

  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      const ev = data[k];

      if (ev.type == "VEVENT") {
        icalEvents.push(ev);
      }
    }
  }

  return icalEvents;
};

describe("schedule", () => {
  test("creates a schedule", () => {
    const bd = { name: "foo bar", day: "2016-02-10", gender: "m" as Gender };
    const events: Event[] = [
      new Event("お宮参り・初宮参り", new RelativeEventPolicy(0, 0, 31)),
      new Event("小学校入学", JapaneseSchoolEventPolicy(6, 3, 0)),
    ];
    const schedule = new Schedule(bd);

    events.forEach((ev) => {
      schedule.add(ev);
    });

    const icalEvents = extractEvents(schedule.toString());

    expect(icalEvents.length).toBe(2);

    // https://github.com/peterbraden/ical.js/issues/103
    expect(icalEvents[0].start?.hasOwnProperty("dateOnly")).toBe(true);

    expect(icalEvents[0].start?.getDate()).toBe(12);
    expect(icalEvents[0].start?.getFullYear()).toBe(2016);
    expect(icalEvents[0].start?.getMonth()).toBe(2);
    expect(icalEvents[0].summary).toBe("foo bar お宮参り・初宮参り");
    expect(icalEvents[0].start?.hasOwnProperty("dateOnly")).toBe(true);
    expect(icalEvents[1].start?.getDate()).toBe(1);
    expect(icalEvents[1].start?.getFullYear()).toBe(2022);
    expect(icalEvents[1].start?.getMonth()).toBe(3);
    expect(icalEvents[1].summary).toBe("foo bar 小学校入学");
  });

  test("creates a schedule with a event for a specific gender", () => {
    const bd = { name: "foo bar", day: "2016-04-30", gender: "f" as Gender };
    const events: Event[] = [
      new Event(
        "七五三 3歳",
        new CompositeEventPolicy(
          new RelativeEventPolicy(3, 0, 0),
          new AbsoluteEventPolicy(10, 14)
        ),
        "f"
      ),
    ];
    let schedule = new Schedule(bd);

    events.forEach((ev) => {
      schedule.add(ev);
    });

    expect(extractEvents(schedule.toString()).length).toBe(1);

    bd.gender = "m";
    schedule = new Schedule(bd);
    events.forEach((ev) => {
      schedule.add(ev);
    });

    expect(extractEvents(schedule.toString()).length).toBe(0);
  });
});
