import moment from "moment";

export interface IEventPolicy {
  apply(date: Date): Date;
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

  apply(date: Date): Date {
    const m = moment
      .utc(date)
      .add(this.days, "days")
      .add(this.months, "months")
      .add(this.years, "years");

    return m.toDate();
  }
}

export class AbsoluteEventPolicy implements IEventPolicy {
  readonly month: number | null;
  readonly day: number | null;

  constructor(month: number | null, day: number | null) {
    this.month = month;
    this.day = day;
  }

  apply(date: Date): Date {
    const m = moment.utc(date);

    if (this.month !== null) {
      m.month(this.month);
    }

    if (this.day !== null) {
      m.date(this.day + 1);
    }

    return m.toDate();
  }
}

export class CountingEventPolicy implements IEventPolicy {
  readonly month: number;
  readonly day: number;

  constructor(month: number, day: number) {
    this.month = month;
    this.day = day;
  }

  apply(date: Date): Date {
    const m = moment.utc(date);
    const delemiterDate = m
      .clone()
      .month(this.month)
      .date(this.day + 1);

    if (m.isSameOrAfter(delemiterDate)) {
      m.add(1, "years");
    }

    return m.toDate();
  }
}

export class CompositeEventPolicy implements IEventPolicy {
  readonly policies: IEventPolicy[];

  constructor(...policies: IEventPolicy[]) {
    this.policies = policies;
  }

  apply(date: Date): Date {
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
