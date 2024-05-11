import { Injectable, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import {
  BehaviorSubject,
  catchError,
  defer,
  delay,
  finalize,
  map,
  Observable,
  of,
  scan,
  startWith,
  switchMap,
  take,
  tap,
  throwError,
  withLatestFrom,
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
}

export interface IQueryResponse<T> {
  data$: Observable<T>;
  loading$: Observable<boolean>;
  fetching$: Observable<boolean>;
  error$: Observable<object | null>;
  changeModel: Function;
}

@Injectable({ providedIn: 'root' })
export class CachedService {
  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  private cached = new BehaviorSubject<any>(null);
  private cached$ = this.cached.asObservable();
  private modelChange$ = new BehaviorSubject<any>(null);

  private data$ = new BehaviorSubject<any>(null);
  private loading$ = new BehaviorSubject(false);
  private error$ = new BehaviorSubject(null);
  private fetching$ = new BehaviorSubject(false);

  public withCached<T, F extends object>(
    params: ICachedParams<T, F>
  ): IQueryResponse<T> {
    const { queryKey, queryFc, queryParams, options } = params;

    //reset data
    this.data$.next(null);
    this.modelChange$.next(queryParams);

    const cachedKey = this.hashKey([...queryKey, queryParams]);

    this.modelChange$
      .pipe(
        map((params) => {
          console.log(params);

          return _.size(params) ? params : queryParams;
        }),
        tap((queryParams) => {
          this.handleCheckInCache(this.hashKey([...queryKey, queryParams]));

          if (_.get(options, 'syncUrl') && _.get(options, 'url')) {
            this.router.navigate([`/${_.get(options, 'url')}`], {
              relativeTo: this.activatedRoute,
              queryParams,
            });
          }
        }),
        switchMap((params) => {
          return queryFc(params as F).pipe(
            delay(1000),
            catchError((err) => {
              this.error$.next(err);
              return throwError(() => err);
            }),
            finalize(() => {
              this.loading$.next(false);
              this.fetching$.next(false);
            })
          );
        }),
        tap((data: T) => {
          if (data) {
            this.cached.next({
              ...this.cached.value,
              [cachedKey]: data,
            });

            this.data$.next(data);
          }
        })
      )
      .subscribe();

    return {
      data$: this.data$.asObservable(),
      loading$: this.loading$.asObservable(),
      fetching$: this.fetching$.asObservable(),
      error$: this.error$.asObservable(),
      changeModel: this.changeModel.bind(this),
    };
  }

  private handleCheckInCache(cachedKey: string) {
    of(true)
      .pipe(
        withLatestFrom(this.cached$),
        tap(([__, val]) => {
          const cachedValue = _.get(val, cachedKey);

          if (cachedValue) {
            this.fetching$.next(true);
            this.data$.next(cachedValue);
          } else {
            this.loading$.next(true);
          }
        })
      )
      .subscribe();
  }

  private hashKey<T>(key: Array<T>): string {
    return JSON.stringify(key);
  }

  public changeModel<T>(model: T | null) {
    this.modelChange$.next(model);
  }
}
