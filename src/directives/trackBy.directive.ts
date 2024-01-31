import { NgForOf } from '@angular/common';
import { Directive, Input, NgIterable, inject } from '@angular/core';

@Directive({
  selector: '[ngForTrackByProp]',
  standalone: true,
})
export class NgForTrackByPropDirective<T> {
  @Input() ngForOf!: NgIterable<T>;

  @Input()
  set ngForTrackByProp(ngForTrackBy: keyof T) {
    // setter
    this.ngFor.ngForTrackBy = (_index: number, item: T) => item[ngForTrackBy];
  }

  private ngFor = inject(NgForOf<T>, { self: true });
}
