import { NgFor } from '@angular/common';
import { NgModule, Provider } from '@angular/core';
import { NgForTrackByPropDirective } from '../../directives/trackBy.directive';

export const NgForTrackByDirective: Provider[] = [NgForTrackByPropDirective];

@NgModule({
  imports: [NgFor, NgForTrackByDirective],
  exports: [NgFor, NgForTrackByDirective],
})
export class NgForTrackByModule {}
