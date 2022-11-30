import { Calendar, CalendarJSON } from "./calendar";
import { getDateMask, getDaysInMonth } from "./utilities";

export const MonthIndices = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

const ONES = ~(1 << 31);

/**
 * Calendar builder class.
 */
export class CalendarBuilder {
  
  /** @type {Calendar[]} */
  private calendars: Calendar[] = [];

  constructor() {}

  /**
   * Get calendar by year
   * @param {number} year Year
   * @returns {Calendar|undefined}
   */
  private getCalendar(year: number): Calendar | undefined {
    return this.calendars.find((c) => c.year === year);
  }

  /**
   * Create a new calendar object and sort the calendar list
   * @param {number} year Year
   * @returns {Calendar}
   */
  private createCalendar(year: number): Calendar {
    const calendar = new Calendar(year);
    this.calendars.push(calendar);
    this.calendars.sort((a, b) => {
      return a.year - b.year;
    });
    return calendar;
  }

  /**
   * Get the calendar if it exists or create it if it doesn't exist
   * @param {number} year
   * @returns {Calendar}
   */
  private getOrCreateCalendar(year: number): Calendar {
    let calendar = this.getCalendar(year);
    if (calendar === undefined) {
      calendar = this.createCalendar(year);
    }
    return calendar;
  }

  /**
   * Every day of the month active
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @returns {number}
   */
  private getMonthAllActive(year: number, monthIndex: number): number {
    const daysInMonth = getDaysInMonth(year, monthIndex);
    return ONES >>> (31 - daysInMonth);
  }

  /**
   * Load an existing calendar
   * @param {Calendar} calendar Calendar
   * @returns {CalendarBuilder}
   */
  public loadCalendar(calendar: Calendar): CalendarBuilder {
    const c = this.getCalendar(calendar.year);
    if (c !== undefined) {
      throw new Error("Calendar already exists for the same year.");
    }
    this.calendars.push(calendar);
    return this;
  }

  /**
   * Load calendar from JSON representation
   * @param {any} json 
   * @returns {CalendarBuilder}
   */
  public fromJSON(json: CalendarJSON): CalendarBuilder {
    if (json) {
      for (let yearStr in json) {
        try {
          const year = parseInt(yearStr, 10);
          const calendar = new Calendar(year);
          /** @type {(number|null)[]} */
          const activeDays: (number | null)[] = json[yearStr];
          calendar.activeDays = activeDays;
          this.calendars.push(calendar);
        } catch (reason) {
          console.warn(reason);
        }
      }
    }
    return this;
  }

  /**
   * Add year calendar
   * @param {number} year Year
   * @returns {CalendarBuilder}
   */
  public addYearCalendar(year: number): CalendarBuilder {
    this.getOrCreateCalendar(year);
    return this;
  }

  /**
   * Initialize calendar with all inactive days
   * @param {number} year Year
   * @returns {CalendarBuilder}
   */
  public initYearAllDaysInactive(year: number): CalendarBuilder {
    const calendar = this.getOrCreateCalendar(year);
    for (let i = 0; i < 12; i++) {
      calendar.activeDays[i] = 0;
    }
    return this;
  }

  /**
   * Initialize calendar with all active days
   * @param {number} year Year
   * @returns {CalendarBuilder}
   */
  public initYearAllDaysActive(year: number): CalendarBuilder {
    const calendar = this.getOrCreateCalendar(year);
    for (let i = 0; i < 12; i++) {
      calendar.activeDays[i] = this.getMonthAllActive(year, i);
    }
    return this;
  }

  /**
   * Initialize calendar with inactive weekends and the rest of the active days
   * @param {number} year Year
   * @returns {CalendarBuilder}
   */
   public initYearWeekendInactive(year: number): CalendarBuilder {
    this.getOrCreateCalendar(year);
    for (let i = 0; i < 12; i++) {
      this.initMonthWeekendInactive(year, i);
    }
    return this;
  }

  /**
   * Initialize month with all inactive days
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @returns {CalendarBuilder}
   */
  public initMonthAllDaysInactive(year: number, monthIndex: number): CalendarBuilder {
    if (monthIndex < MonthIndices.January || monthIndex > MonthIndices.December) {
      const error = `Month index out of range: ${monthIndex}`;
      throw new Error(error);
    }
    const calendar = this.getOrCreateCalendar(year);
    calendar.activeDays[monthIndex] = 0;
    return this;
  }

  /**
   * Initialize month with all active days
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @returns {CalendarBuilder}
   */
  public initMonthAllDaysActive(year: number, monthIndex: number): CalendarBuilder {
    if (monthIndex < MonthIndices.January || monthIndex > MonthIndices.December) {
      const error = `Month index out of range: ${monthIndex}`;
      throw new Error(error);
    }
    const calendar = this.getOrCreateCalendar(year);
    calendar.activeDays[monthIndex] = this.getMonthAllActive(year, monthIndex);
    return this;
  }

  /**
   * Initialize month with inactive weekends and the rest of the active days
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @returns {CalendarBuilder}
   */
  public initMonthWeekendInactive(year: number, monthIndex: number): CalendarBuilder {
    if (monthIndex < MonthIndices.January || monthIndex > MonthIndices.December) {
      const error = `Month index out of range: ${monthIndex}`;
      throw new Error(error);
    }
    const calendar = this.getOrCreateCalendar(year);
    const daysInMonth = getDaysInMonth(year, monthIndex);
    let monthActiveDays = this.getMonthAllActive(year, monthIndex);
    let mask = 1;
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, monthIndex, i);
      const day = d.getDay();
      if (day === 0 || day === 6) {
        monthActiveDays = monthActiveDays ^ mask;
      }
      mask = mask << 1;
    }
    calendar.activeDays[monthIndex] = monthActiveDays;
    return this;
  }

  /**
   * Set a date as active
   * @param {Date} date Date
   * @returns {CalendarBuilder}
   */
  public seDayAsActiveDayFromDate(date: Date): CalendarBuilder {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const day = date.getDate();
    return this.setDayAsActive(year, monthIndex, day);
  }

  /**
   * Set a date as active
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   * @returns {CalendarBuilder}
   */
  public setDayAsActive(year: number, monthIndex: number, date: number): CalendarBuilder {
    if (monthIndex < MonthIndices.January || monthIndex > MonthIndices.December) {
      const error = `Month index out of range: ${monthIndex}`;
      throw new Error(error);
    }
    const daysInMonth = getDaysInMonth(year, monthIndex);
    if (date < 0 || date > daysInMonth) {
      const error = `Date out of range: ${date}`;
      throw new Error(error);
    }
    const calendar = this.getOrCreateCalendar(year);
    let monthActiveDays = calendar.activeDays[monthIndex];
    if (!monthActiveDays) {
      monthActiveDays = 0;
    }
    const mask = getDateMask(calendar.year, monthIndex, date);
    calendar.activeDays[monthIndex] = monthActiveDays | mask;
    return this;
  }

  /**
   * Set a date as inactive
   * @param {Date} date Date
   * @returns {CalendarBuilder}
   */
  public setDayAsInactiveDayFromDate(date: Date): CalendarBuilder {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const day = date.getDate();
    return this.setDayAsActive(year, monthIndex, day);
  }

  /**
   * Set a date as inactive
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   * @returns {CalendarBuilder}
   */
  public setDayAsInactive(year: number, monthIndex: number, date: number): CalendarBuilder {
    if (monthIndex < MonthIndices.January || monthIndex > MonthIndices.December) {
      const error = `Month index out of range: ${monthIndex}`;
      throw new Error(error);
    }
    const daysInMonth = getDaysInMonth(year, monthIndex);
    if (date < 0 || date > daysInMonth) {
      const error = `Date out of range: ${date}`;
      throw new Error(error);
    }
    const calendar = this.getOrCreateCalendar(year);
    let monthActiveDays = calendar.activeDays[monthIndex];
    if (!monthActiveDays) {
      monthActiveDays = 0;
    }
    const mask = getDateMask(calendar.year, monthIndex, date, true);
    calendar.activeDays[monthIndex] = monthActiveDays & mask;
    return this;
  }

  /**
   * Set a range as active
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} start Start date (same month)
   * @param {number} end End date (same month)
   * @returns {CalendarBuilder}
   */
  public setRangeAsActive(year: number, monthIndex: number, start: number, end: number): CalendarBuilder {
    if (start > end) {
      throw new Error("Start date must be less than the end date");
    }
    for (let i = start; i <= end; i++) {
      this.setDayAsActive(year, monthIndex, i);
    }
    return this;
  }

  /**
   * Set a range as inactive
   * @param {number} year Year
   * @param {number} monthIndex Month index (base 0)
   * @param {number} start Start date (same month)
   * @param {number} end End date (same month)
   * @returns {CalendarBuilder}
   */
   public setRangeAsInactive(year: number, monthIndex: number, start: number, end: number): CalendarBuilder {
    if (start > end) {
      throw new Error("Start date must be less than the end date");
    }
    for (let i = start; i <= end; i++) {
      this.setDayAsInactive(year, monthIndex, i);
    }
    return this;
  }

  /**
   * Build all calendars
   * @returns {Calendar[]}
   */
  public buildAll(): Calendar[] {
    return this.calendars;
  }

  /**
   * Build a calendar by year
   * @param {number} year Year
   * @returns {Calendar}
   */
  public build(year: number): Calendar {
    return this.getOrCreateCalendar(year);
  }
}