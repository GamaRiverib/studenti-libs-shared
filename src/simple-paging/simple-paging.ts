import { IEntity, IWherePropParam } from 'fireorm';

export type SortDirection = 'asc' | 'desc';

export type SimplePagingOptions<T extends IEntity> = {
  cursor?: string;
  offset?: number;
  limit?: number;
  direction?: SortDirection;
  sort?: IWherePropParam<T>;
};

export class SimplePaging<T extends IEntity> {
  cursor?: string;
  offset?: number;
  limit: number;
  direction?: SortDirection;
  sort?: IWherePropParam<T>;

  static getInstance<T extends IEntity>(
    options: SimplePagingOptions<T>,
  ): SimplePaging<T> {
    if (options.limit && !Number.isInteger(options.limit)) {
      options.limit = parseInt(options.limit.toString());
    }
    const cursor: string | undefined = options.cursor;
    const limit: number = options.limit || 100;
    const offset: number = options.offset || 0;
    const direction: SortDirection = options.direction
      ? options.direction
      : 'desc';
    const sort: IWherePropParam<T> = options.sort;
    return { cursor, offset, limit, direction, sort };
  }
}
