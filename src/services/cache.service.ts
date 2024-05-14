import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import _ from 'lodash';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  delay,
  finalize,
  Observable,
  of,
  skipWhile,
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
  debounceTime?: number;
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
  ) {
    this.modelChange$
      .pipe(
        tap((queryParams) => {
          this.handleSyncQueryParams(queryParams!);
        }),
        skipWhile(() => !this.data$.value),
        debounceTime(_.get(this.initConfig, 'options.debounceTime') || 300),
        tap((queryParams) => {
          this.withCached({
            ...this.initConfig,
            queryParams: queryParams as Params,
          });
        })
      )
      .subscribe();
  }

  private cached = new BehaviorSubject<object | null>(null);
  private cached$ = this.cached.asObservable();
  private modelChange$ = new BehaviorSubject<Params | null>(null);

  private data$ = new BehaviorSubject<object | null>(null);
  private loading$ = new BehaviorSubject(false);
  private error$ = new BehaviorSubject(null);
  private fetching$ = new BehaviorSubject(false);

  private initConfig!: ICachedParams<object, object>;

  public withCached<T, F extends object>(
    params: ICachedParams<T, F>
  ): IQueryResponse<T> {
    const { queryKey, queryFc, queryParams } = params;

    //reset data
    this.data$.next(null);
    this.initConfig = params as any;

    //check data in cache
    const cachedKey = this.hashKey([...queryKey, queryParams]);
    this.handleCheckInCache(cachedKey);
    this.handleSyncQueryParams(queryParams);

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

            this.data$.next(data);
          }
        }),
        catchError((err) => {
          this.error$.next(err);
          return throwError(() => err);
        }),
        finalize(() => {
          this.loading$.next(false);
          this.fetching$.next(false);
        }),
        take(1)
      )
      .subscribe();

    return {
      data$: this.data$.asObservable() as Observable<T>,
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
        }),
        finalize(() => {
          console.log('finalize');
        })
      )
      .subscribe();
  }

  private hashKey<T>(key: Array<T>): string {
    return JSON.stringify(key);
  }

  public changeModel<F extends Params>(model: F | null) {
    this.modelChange$.next(model);
  }

  handleSyncQueryParams<F extends Params>(queryParams: F) {
    if (!_.isEmpty(this.initConfig)) {
      const { options } = this.initConfig;
      if (!options) return;

      const { url, syncUrl } = options!;
      if (syncUrl && url) {
        this.router.navigate([`/${url}`], {
          relativeTo: this.activatedRoute,
          queryParams,
        });
      }
    }
  }
}
