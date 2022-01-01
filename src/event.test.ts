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
        new Event(0, 0, 31, null, null, false, "お宮参り・初宮参り"),
        {
          date: new Date(Date.parse("2016-03-12T00:00:00.000Z")),
          summary: "foo お宮参り・初宮参り",
        },
      ],
      [
        earlyBirthday,
        new Event(3, 0, 0, 10, 14, true, "七五三 3歳", "f"),
        null,
      ],
      [
        earlyBirthday,
        new Event(6, 0, 0, 3, 0, true, "小学校入学"),
        {
          date: new Date(Date.parse("2022-04-01T00:00:00.000Z")),
          summary: "foo 小学校入学",
        },
      ],
      [
        lateBirthday,
        new Event(6, 0, 0, 3, 0, true, "小学校入学"),
        {
          date: new Date(Date.parse("2023-04-01T00:00:00.000Z")),
          summary: "bar 小学校入学",
        },
      ],
    ];

    tests.forEach(([bd, ev, expected]) => {
      const actual = ev.apply(bd);

      expect(actual).toEqual(expected);
    });
  });
});
