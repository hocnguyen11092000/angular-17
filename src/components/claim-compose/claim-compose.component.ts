import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-claim-compose',
  template: ` <h3>hello from claim compose component</h3> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimCompose {}
