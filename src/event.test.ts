import { Temporal } from "@js-temporal/polyfill";
import {
  CompositeEventPolicy,
  RelativeEventPolicy,
  AbsoluteEventPolicy,
  CountingEventPolicy,
} from "./event_policy";
import { Gender, IBirthDay } from "./birthday";
import { Event, IEvent, IEventApplication } from "./event";

describe("event", () => {
  test("applies to a birthday", () => {
    const earlyBirthday = {
      day: "2016-02-10",
      name: "foo",
      gender: "m" as Gender,
    };
    const lateBirthday = {
      day: "2016-08-18",
      name: "bar",
      gender: "f" as Gender,
    };
    const tests: [IBirthDay, IEvent, IEventApplication | null][] = [
      [
        earlyBirthday,
        new Event("お宮参り・初宮参り", new RelativeEventPolicy(0, 0, 31)),
        {
          date: Temporal.PlainDate.from("2016-03-12"),
          summary: "foo お宮参り・初宮参り",
        },
      ],
      [
        earlyBirthday,
        new Event(
          "七五三 3歳",
          new CompositeEventPolicy(
            new RelativeEventPolicy(3, 0, 0),
            new AbsoluteEventPolicy(10, 14)
          ),
          "f"
        ),
        null,
      ],
      [
        earlyBirthday,
        new Event(
          "小学校入学",
          new CompositeEventPolicy(
            new CountingEventPolicy(3, 1),
            new RelativeEventPolicy(6, 0, 0),
            new AbsoluteEventPolicy(3, 0)
          )
        ),
        {
          date: Temporal.PlainDate.from("2022-04-01"),
          summary: "foo 小学校入学",
        },
      ],
      [
        lateBirthday,
        new Event(
          "小学校入学",
          new CompositeEventPolicy(
            new CountingEventPolicy(3, 1),
            new RelativeEventPolicy(6, 0, 0),
            new AbsoluteEventPolicy(3, 0)
          )
        ),
        {
          date: Temporal.PlainDate.from("2023-04-01"),
          summary: "bar 小学校入学",
        },
      ],
      [
        earlyBirthday,
        new Event(
          "初節句",
          new CompositeEventPolicy(
            new CountingEventPolicy(2, 2),
            new AbsoluteEventPolicy(2, 2)
          )
        ),
        {
          date: Temporal.PlainDate.from("2016-03-03"),
          summary: "foo 初節句",
        },
      ],
      [
        lateBirthday,
        new Event(
          "初節句",
          new CompositeEventPolicy(
            new CountingEventPolicy(2, 2),
            new AbsoluteEventPolicy(2, 2)
          )
        ),
        {
          date: Temporal.PlainDate.from("2017-03-03"),
          summary: "bar 初節句",
        },
      ],
    ];

    tests.forEach(([bd, ev, expected]) => {
      const actual = ev.apply(bd);

      expect(actual).toEqual(expected);
    });
  });
});
