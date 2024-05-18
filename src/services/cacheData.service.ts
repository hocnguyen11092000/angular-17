import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CacheDataService<T extends object = object> {
  private cached = new BehaviorSubject<T | null>(null);
  public cached$ = this.cached.asObservable();

  get cachedData() {
    return this.cached.getValue()!;
  }

  set cachedData(data: T) {
    this.cached.next(data);
  }
}
