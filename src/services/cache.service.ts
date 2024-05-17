import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  Observable,
  take,
  tap,
  throwError,
} from 'rxjs';

export interface ICachedParams<T, F extends object> {
  queryKey: Array<string>;
  queryFc: (queryParams: F) => Observable<T>;
  queryParams: F;
  options?: ICachedParamsOptions;
}

export interface ICachedParamsOptions {
  syncUrl?: boolean;
  url?: string;
  debounceTime?: number;
}

export interface IQueryResponse<T> {
  data$: Observable<T>;
  loading$: Observable<boolean>;
  fetching$: Observable<boolean>;
  error$: Observable<object | null>;
}

@Injectable({ providedIn: 'root' })
export class CachedService {
  constructor() {}
  private cached = new BehaviorSubject<object | null>(null);

  public withCached<T, F extends object>(
    params: ICachedParams<T, F>
  ): IQueryResponse<T> {
    const { queryKey, queryFc, queryParams } = params;

    const data$ = new BehaviorSubject<T | null>(null);
    const loading$ = new BehaviorSubject<boolean>(false);
    const error$ = new BehaviorSubject<object | null>(null);
    const fetching$ = new BehaviorSubject<boolean>(false);

    //check data in cache
    const cachedKey = this.hashKey([...queryKey, queryParams]);
    const cachedValue = _.get(this.cached.value, cachedKey);

    if (cachedValue) {
      fetching$.next(true);
      data$.next(cachedValue);
    } else {
      loading$.next(true);
    }

    //query data & re update cache
    queryFc(queryParams as F)
      .pipe(
        delay(1000),
        tap((data: T) => {
          if (data) {
            this.cached.next({
              ...this.cached.value,
              [this.hashKey([...queryKey, queryParams])]: data,
            });

            console.log(this.cached.value);

            data$.next(data);
          }
        }),
        catchError((err) => {
          error$.next(err);
          return throwError(() => err);
        }),
        finalize(() => {
          loading$.next(false);
          fetching$.next(false);
        }),
        take(1)
      )
      .subscribe();

    return {
      data$: data$.asObservable() as Observable<T>,
      loading$: loading$.asObservable(),
      fetching$: fetching$.asObservable(),
      error$: error$.asObservable(),
    };
  }

  private hashKey<T>(key: Array<T>): string {
    return JSON.stringify(key);
  }
}
