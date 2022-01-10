import { Temporal } from "@js-temporal/polyfill";

export interface IEventPolicy {
  apply(date: Temporal.PlainDate): Temporal.PlainDate;
}

export class RelativeEventPolicy implements IEventPolicy {
  readonly years: number;
  readonly months: number;
  readonly days: number;

  constructor(years: number, months: number, days: number) {
    this.years = years;
    this.months = months;
    this.days = days;
  }

  apply(date: Temporal.PlainDate): Temporal.PlainDate {
    return date
      .add({ days: this.days })
      .add({ months: this.months })
      .add({ years: this.years });
  }
}

export class AbsoluteEventPolicy implements IEventPolicy {
  readonly month: number | null;
  readonly day: number | null;

  constructor(month: number | null, day: number | null) {
    this.month = month;
    this.day = day;
  }

  apply(date: Temporal.PlainDate): Temporal.PlainDate {
    if (this.month !== null) {
      date = date.with({ month: this.month + 1 });
    }

    if (this.day !== null) {
      date = date.with({ day: this.day + 1 });
    }

    return date;
  }
}

export class CountingEventPolicy implements IEventPolicy {
  readonly month: number;
  readonly day: number;

  constructor(month: number, day: number) {
    this.month = month;
    this.day = day;
  }

  apply(date: Temporal.PlainDate): Temporal.PlainDate {
    const delemiterDate = date
      .with({ month: this.month + 1 })
      .with({ day: this.day + 1 });

    if (Temporal.PlainDate.compare(date, delemiterDate) == 1) {
      date.add({ years: 1 });
    }

    return date;
  }
}

export class CompositeEventPolicy implements IEventPolicy {
  readonly policies: IEventPolicy[];

  constructor(...policies: IEventPolicy[]) {
    this.policies = policies;
  }

  apply(date: Temporal.PlainDate): Temporal.PlainDate {
    let result = date;

    for (const policy of this.policies) {
      result = policy.apply(result);
    }

    return result;
  }
}

export const JapaneseSchoolEventPolicy = (
  years: number,
  month: number,
  day: number
): IEventPolicy => {
  return new CompositeEventPolicy(
    // https://www.mext.go.jp/a_menu/shotou/shugaku/detail/1422233.htm
    //
    // > 4月1日生まれの児童生徒の学年は、翌日の4月2日以降生まれの児童生徒の学年より一つ上、ということになり、
    // > 一学年は4月2日生まれから翌年の4月1日生まれの児童生徒までで構成されることになります。
    new CountingEventPolicy(3, 1),

    new RelativeEventPolicy(years, 0, 0),
    new AbsoluteEventPolicy(month, day)
  );
};
