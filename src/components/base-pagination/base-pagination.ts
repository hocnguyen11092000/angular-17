import { BehaviorSubject } from 'rxjs';

export interface IBasePagination {
  _start: number;
  _limit: number;
}

export abstract class BasePagination<
  T extends IBasePagination = IBasePagination
> {
  public model$!: BehaviorSubject<T>;

  public handlePageChange(currentPage: number) {
    const model = this.model$.value;
    const _start = currentPage * model._limit;

    if (this.model$ && this.model$ instanceof BehaviorSubject) {
      this.model$.next({
        ...this.model$.value,
        _start,
      });
    }
  }

  public handlePageSizeChange(pageSize: number) {
    const model = this.model$.value;

    if (this.model$ && this.model$ instanceof BehaviorSubject) {
      this.model$.next({
        ...model,
        _limit: pageSize,
      });
    }
  }
}
