import { Gender } from "./birthday";
import { Event } from "./event";

describe("event", () => {
  test("applies to a birthday", () => {
    const event = new Event(0, 0, 31, null, null, false, "お宮参り・初宮参り");
    const birthday = {
      day: "2016-02-10",
      name: "foo",
      gender: "m" as Gender,
    };
    const res = event.apply(birthday);

    expect(res).not.toBeNull();
    expect(res?.date).toBe("03/12/2016");
    expect(res?.tz).toBe("+09:00");
    expect(res?.summary).toBe("foo お宮参り・初宮参り");
  });
});
