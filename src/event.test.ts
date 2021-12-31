import { Event } from "./event";

describe("event", () => {
  test("returns summary", () => {
    const event = new Event(0, 0, 31, null, null, false, "お宮参り・初宮参り");

    expect(event.summary("foo")).toBe("foo お宮参り・初宮参り");
  });
});
