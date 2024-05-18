import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import {
  BehaviorSubject,
  debounceTime,
  Observable,
  shareReplay,
  skipUntil,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-base-list',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseListComponent<T extends object, L extends object>
  implements OnInit, OnDestroy
{
  //#region subjects
  private triggerSearch$ = new BehaviorSubject<T | null>(null);
  private skip$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  data$: BehaviorSubject<Array<L> | null> =
    new BehaviorSubject<Array<L> | null>(null);
  //#endregion subjects

  //#region default variables
  model!: T;
  getList!: (queryParams: T) => Observable<Array<L>>;
  debounceTime: number = 300;
  initQueryParams!: T;
  isModelChange: boolean = false;
  //#endregion default variables

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        tap((query) => {
          if (!_.isEmpty(query)) {
            this.model = { ...query } as T;
            this.initQueryParams = this.model;
          }
        }),
        take(1)
      )
      .subscribe();

    this.triggerSearch$
      .pipe(
        skipUntil(this.skip$),
        tap((queryParams) => {
          this.router.navigate(['.'], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
          });
        }),
        debounceTime(this.debounceTime),
        switchMap((queryParams: T | null) => {
          return this.getList(queryParams!);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.data$.next(data);
      });

    if (!this.isModelChange) {
      this.handleStartApi();
    }

    this.ngOnChildrenInit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.ngOnChildrenDestroy();
  }

  handleSearch(key?: string, value?: string) {
    if (key && value) {
      _.set(this.model, key, value);
    }

    this.triggerSearch$.next(this.model);
  }

  handleRefresh() {
    this.triggerSearch$.next(this.model);
  }

  handleReset(newInstance: T) {
    this.model = newInstance;
    this.triggerSearch$.next(this.model);
  }

  handleStartApi(): void {
    this.skip$.next();
    this.skip$.complete();

    this.triggerSearch$.next(this.model);
  }

  //#region life circle for children
  ngOnChildrenInit() {}

  ngOnChildrenDestroy() {}
  //#endregion life circle for children
}
