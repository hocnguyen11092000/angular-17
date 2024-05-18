import { Params } from '@angular/router';

export interface IPostQueryParams extends Params {
  _start: number;
  _limit: number;
  title_like: string;
}
