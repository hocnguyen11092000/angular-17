import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LargeComponent } from '../large/large.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-defer',
  template: `
    <h3>hello from defer component</h3>
    <app-large></app-large>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LargeComponent, CommonModule],
})
export class DeferComponent {}
