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
  readonly years: number;
  readonly month: number;
  readonly day: number;

  constructor(years: number, month: number, day: number) {
    this.years = years;
    this.month = month;
    this.day = day;
  }

  apply(date: Date): Date {
    const m = moment.utc(date);
    const delemiterDate = m.clone();

    if (this.month !== null) {
      delemiterDate.month(this.month);
    }

    if (this.day !== null) {
      delemiterDate.date(this.day + 1);
    }

    if (m.isBefore(delemiterDate)) {
      m.add(this.years, "years");
    } else {
      m.add(this.years + 1, "years");
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
