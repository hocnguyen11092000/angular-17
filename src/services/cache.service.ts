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
    const { queryKey, queryFc, queryParams } = params;

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
    const cachedKey = this.hashKey([...queryKey, queryParamsValue]);
    const cachedValue = _.get(this.cacheDataService.cachedData, cachedKey);

    if (cachedValue) {
      fetching$.next(true);
      data$.next(cachedValue);
    } else {
      loading$.next(true);
    }

    if (queryParams instanceof BehaviorSubject) {
      queryParams
        .pipe(
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
}
