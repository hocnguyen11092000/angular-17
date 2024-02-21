import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UrlService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  private currentUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentUrl$: Observable<string> = this.previousUrl.asObservable();

  private readonly router = inject(Router);
  private readonly activedRoute = inject(ActivatedRoute);

  constructor() {}

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

  setCurrentUrl(currentUrl: string) {
    this.currentUrl.next(currentUrl);

    if (
      this.pre.includes(this.current) &&
      _.size(this.pre) > _.size(this.current)
    ) {
      this.router.navigateByUrl(this.pre);
    }
  }

  get current(): string {
    return this.currentUrl.getValue();
  }

  get pre(): string {
    return this.previousUrl.getValue();
  }
}
