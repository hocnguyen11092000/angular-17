import _ from 'lodash';
import { IPostQueryParams } from '../interfaces';

export class PostModel {
  _start: number = 0;
  _limit: number = 5;
  title_like: string = '';

  constructor(query: IPostQueryParams | null) {
    if (!_.isEmpty(query)) {
      this._start = query._start;
      this._limit = query._limit;
      this.title_like = query.title_like;
    }
  }
}
