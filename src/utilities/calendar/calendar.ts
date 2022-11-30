import { getDateMask } from "./utilities";

export type CalendarJSON = {
  [year: number]: (number|null)[];
};

export class Calendar {
  /** @type {number} */
  year: number;
  /** @type {(number|null)[]} */
  activeDays: (number | null)[];

  /**
   * Calendar constructor
   * @param {number} year Year
   */
  constructor(year: number) {
    const y = typeof year === 'string' ? parseInt(year, 10) : year;
    Object.defineProperty(this, 'year', {
      value: y,
      writable: false,
    });
  }

  /**
   * Validates if a day is configured as active in the calendar
   * @param {number} monthIndex Month index (base 0)
   * @param {number} date Date
   * @returns {boolean} True if is active day
   */
  isActive(monthIndex: number, date: number): boolean {
    const month = this.activeDays[monthIndex];
    if (!month) {
      const error = `Unspecified active days of the month index: ${monthIndex}`;
      throw new Error(error);
    }
    const mask = getDateMask(this.year, monthIndex, date);
    return (mask & month) > 0;
  }

  /**
   * JSON calendar
   * @returns {Object.<number, (number | null)[]>}
   */
  toJSON(): CalendarJSON {
    /** @type {Object.<number, (number | null)[]>} */
    const json = {};
    json[this.year] = this.activeDays;
    return json;
  }

  static fromJSON(json: CalendarJSON): Calendar[] {
    const calendars = [];
    if (json) {
      for (let yearStr in json) {
        try {
          const year = parseInt(yearStr, 10);
          const activeDays = json[yearStr];
          calendars.push({ year, activeDays });
        } catch (reason) {
          console.warn(reason);
        }
      }
    }
    return calendars;
  }
}
