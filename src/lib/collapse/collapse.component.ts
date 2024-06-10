import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-collapse',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollapseComponent {}
