import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import _ from 'lodash';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  Observable,
  switchMap,
  take,
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
  triggerSearch$ = new BehaviorSubject<T | null>(null);
  data$: BehaviorSubject<Array<L> | null> =
    new BehaviorSubject<Array<L> | null>(null);
  //#endregion subjects

  //#region default variables
  model!: T;
  getList!: (queryParams: T) => Observable<Array<L>>;
  debounceTime: number = 300;
  defaultUrlQueryParams!: T;
  //#endregion default variables

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        tap((query) => {
          if (!_.isEmpty(query)) {
            this.model = { ...query } as T;
            this.triggerSearch$.next(this.model);
          }
        }),
        take(1)
      )
      .subscribe();

    this.triggerSearch$
      .pipe(
        tap((queryParams) => {
          this.router.navigate(['.'], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
          });
        }),
        debounceTime(this.debounceTime),
        switchMap((queryParams: T | null) => {
          return this.getList(queryParams!);
        })
      )
      .subscribe((data) => {
        this.data$.next(data);
        this.cdr.markForCheck();
      });

    this.ngOnChildrenInit();
  }

  ngOnDestroy(): void {
    this.ngOnDestroy();
  }

  handleSearch(value: string) {
    this.triggerSearch$.next(this.model);
  }

  handleRefresh() {
    this.triggerSearch$.next(this.model);
  }

  handleReset(newInstance: T) {
    this.model = newInstance;

    this.triggerSearch$.next(this.model);
  }

  //#region life circle for children
  ngOnChildrenInit() {}

  ngOnChildrenDestroy() {}
  //#endregion life circle for children
}
