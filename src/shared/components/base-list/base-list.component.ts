import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import {
  BehaviorSubject,
  debounceTime,
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
  implements OnInit
{
  triggerSearch$ = new BehaviorSubject<T | null>(null);
  model!: T;
  getList$!: (path: string | undefined, queryParams: T) => Observable<Array<L>>;
  data!: Array<L>;
  debouceTime: number = 300;

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
          }

          this.triggerSearch$.next(this.model);
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
        debounceTime(this.debouceTime),
        switchMap((queryParams: T | null) => {
          return this.getList$(undefined, queryParams!);
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.cdr.markForCheck();
      });
  }

  handleSearch(value: string) {
    _.set(this.model, 'title_like', value);

    this.triggerSearch$.next(this.model);
  }

  handleRefresh() {
    this.triggerSearch$.next(this.model);
  }

  handleReset(newInstance: T) {
    this.model = newInstance;

    this.triggerSearch$.next(this.model);
  }
}
