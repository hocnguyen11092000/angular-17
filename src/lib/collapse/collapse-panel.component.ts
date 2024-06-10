import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

const DEFAULT_DURATION = 250;

@Component({
  selector: 'ui-collapse-panel',
  template: `
    <div class="header" (click)="handleActiveChange()">
      <ng-content select="collapse-header"></ng-content>
    </div>
    <div class="body collapsible" [@collapse]="!active()">
      <div class="content">
        <ng-content select="collapse-body"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .header {
        background: #eee;
        padding: 8px;
        border-radius: 2px;
        cursor: pointer;
      }

      .body {
        .content {
          padding: 8px;
          border-radius: 2px;
          background: #eee;
        }
      }

      .collapsible {
        overflow: hidden;
      }
    `,
  ],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollapsePanelComponent {
  skipClickHeader = input(false);
  active = model(true);

  handleActiveChange() {
    if (!this.skipClickHeader()) {
      this.active.set(!this.active());
    }
  }
}
