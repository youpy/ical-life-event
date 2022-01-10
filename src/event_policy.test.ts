import { Temporal } from "@js-temporal/polyfill";
import {
  RelativeEventPolicy,
  AbsoluteEventPolicy,
  CountingEventPolicy,
  CompositeEventPolicy,
  JapaneseSchoolEventPolicy,
} from "./event_policy";

const sd = (dateString: string) => Temporal.PlainDate.from(dateString);

describe("RelativeEventPolicy", () => {
  it("apples", () => {
    expect(new RelativeEventPolicy(1, 2, 3).apply(sd("2020-01-01"))).toEqual(
      sd("2021-03-04")
    );
  });
});

describe("AbsoluteEventPolicy", () => {
  it("apples", () => {
    expect(new AbsoluteEventPolicy(1, 2).apply(sd("2020-01-01"))).toEqual(
      sd("2020-02-03")
    );
  });
});

describe("CountingEventPolicy", () => {
  it("apples", () => {
    expect(new CountingEventPolicy(3, 1).apply(sd("2020-01-01"))).toEqual(
      sd("2020-01-01")
    );
    expect(new CountingEventPolicy(3, 1).apply(sd("2020-04-01"))).toEqual(
      sd("2020-04-01")
    );
    expect(new CountingEventPolicy(3, 1).apply(sd("2020-04-02"))).toEqual(
      sd("2021-04-02")
    );
  });
});

describe("CompositeEventPolicy", () => {
  it("apples", () => {
    expect(
      new CompositeEventPolicy(
        new CountingEventPolicy(3, 1),
        new RelativeEventPolicy(6, 0, 0),
        new AbsoluteEventPolicy(3, 0)
      ).apply(sd("2020-01-01"))
    ).toEqual(sd("2026-04-01"));

    expect(
      new CompositeEventPolicy(
        new CountingEventPolicy(3, 1),
        new RelativeEventPolicy(6, 0, 0),
        new AbsoluteEventPolicy(3, 0)
      ).apply(sd("2020-04-02"))
    ).toEqual(sd("2027-04-01"));
  });

  describe("JapaneseSchoolEventPolicy", () => {
    it("apples", () => {
      expect(
        JapaneseSchoolEventPolicy(6, 3, 0).apply(sd("2020-01-01"))
      ).toEqual(sd("2026-04-01"));
      expect(
        JapaneseSchoolEventPolicy(6, 3, 0).apply(sd("2020-08-12"))
      ).toEqual(sd("2027-04-01"));
    });
  });
});
