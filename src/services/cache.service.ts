import { Injectable, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { CacheDataService } from './cacheData.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

export interface ICachedParams<T, F extends object> {
  queryKey: Array<string>;
  queryFc: (queryParams: F) => Observable<T>;
  queryParams: F | BehaviorSubject<F>;
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

export type TQueryResponse<T> = {
  [key in keyof IQueryResponse<T>]: BehaviorSubject<
    IQueryResponse<T>[key] extends Observable<infer O> ? O : never
  >;
};

@Injectable()
export class CachedService implements OnDestroy {
  constructor(
    private readonly cacheDataService: CacheDataService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}
  //#region variables
  private subjects: Array<BehaviorSubject<any>> = [];
  //#endregion variable

  //#region subjects
  destroy$ = new Subject<void>();
  //#endregion subjects

  public withCached<T, F extends object>(
    params: ICachedParams<T, F>
  ): IQueryResponse<T> {
    //variables in params
    const { queryKey, queryFc, queryParams, options } = params;

    //variables for response
    const data$ = new BehaviorSubject<T | null>(null);
    const loading$ = new BehaviorSubject<boolean>(false);
    const error$ = new BehaviorSubject<object | null>(null);
    const fetching$ = new BehaviorSubject<boolean>(false);

    //store subjects and mark it as completed after service is destroyed
    //service is destroyed when component inject it is destroyed (inject in component level)
    this.subjects = [...this.subjects, data$, loading$, error$, fetching$];

    //check data in cache
    const queryParamsValue =
      queryParams instanceof BehaviorSubject
        ? queryParams.getValue()
        : queryParams;

    this.handleCheckAndResolveCache(queryKey, queryParamsValue, {
      loading$,
      data$,
      fetching$,
    });

    if (queryParams instanceof BehaviorSubject) {
      queryParams
        .pipe(
          tap((query: Params) => {
            this.handleSyncQueryParams(options!, query);

            this.handleCheckAndResolveCache(queryKey, query, {
              loading$,
              data$,
              fetching$,
            });
          }),
          switchMap((query: Params) => {
            return queryFc(query as F).pipe(
              delay(500),
              catchError((err) => {
                error$.next(err);
                return throwError(() => err);
              }),
              finalize(() => {
                loading$.next(false);
                fetching$.next(false);
              })
            );
          }),
          tap((data: T) => {
            if (data) {
              this.handleStoreDataIntoCache<T, F>(
                data,
                queryKey,
                queryParams.getValue()
              );

              data$.next(data);
            }
          }),
          takeUntil(this.destroy$),
          finalize(() => {
            console.log('finalizing');
          })
        )
        .subscribe();
    } else {
      this.handleSyncQueryParams(options!, queryParams);

      queryFc(queryParams as F)
        .pipe(
          delay(500),
          tap((data: T) => {
            if (data) {
              this.handleStoreDataIntoCache<T, F>(data, queryKey, queryParams);
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
    }

    return {
      data$: data$.asObservable() as Observable<T>,
      loading$: loading$.asObservable(),
      fetching$: fetching$.asObservable(),
      error$: error$.asObservable(),
    };
  }

  private handleStoreDataIntoCache<T, F>(
    data: T,
    queryKey: Array<string>,
    queryParams: F
  ) {
    this.cacheDataService.cachedData = {
      ...this.cacheDataService.cachedData,
      [this.hashKey([...queryKey, queryParams])]: data,
    };
  }

  private hashKey<T>(key: Array<T>): string {
    return JSON.stringify(key);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    _.forEach(this.subjects, (subject) => {
      subject.complete();
    });

    console.log('service destroyed');
  }

  private handleCheckAndResolveCache<T>(
    queryKey: Array<string>,
    query: Params,
    state: Pick<TQueryResponse<T>, 'data$' | 'fetching$' | 'loading$'>
  ) {
    const { fetching$, loading$, data$ } = state;

    const cachedKey = this.hashKey([...queryKey, query]);
    const cachedValue = _.get(this.cacheDataService.cachedData, cachedKey);

    if (cachedValue) {
      fetching$.next(true);
      data$.next(cachedValue);
    } else {
      loading$.next(true);
    }
  }

  private handleSyncQueryParams<T extends ICachedParamsOptions>(
    options: T,
    queryParams: Params
  ) {
    if (!_.size(options)) return;

    const { url, syncUrl } = options;
    if (url && syncUrl) {
      this.router.navigate([`/${url}`], {
        relativeTo: this.activatedRoute,
        queryParams,
      });
    }
  }
}
