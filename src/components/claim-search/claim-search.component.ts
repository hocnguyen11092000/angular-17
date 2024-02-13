import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-claim-search',
  template: ` <h3>hello from claim search</h3> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchClaim {}
