import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CollapseComponent } from '../../lib/collapse/collapse.component';
import { CollapsePanelComponent } from '../../lib/collapse/collapse-panel.component';

@Component({
  selector: 'app-css-grid',
  template: `
    <h3>css grid</h3>
    <div hidden class="container">
      <div class="row g-3">
        <div class="col-12 col-xl-6 col-sm-6 ">
          <input type="text" placeholder="type..." />
        </div>
        <div class="col-12 col-xl-6 col-sm-6 ">
          <input type="text" placeholder="type..." />
        </div>
        <div class="col-12 col-xl-6 col-sm-6 ">
          <input type="text" placeholder="type..." />
        </div>
        <div class="col-12 col-xl-6 col-sm-6 ">
          <input type="text" placeholder="type..." />
        </div>
      </div>
    </div>
    <div class="my-2">
      <ui-collapse>
        <ui-collapse-panel
          [(active)]="active"
          (activeChange)="handleActiveChange($event)"
          [skipClickHeader]="true"
        >
          <div ngProjectAs="collapse-header">
            <div class="d-flex justify-content-between">
              <div>this is header</div>
              <div>
                <button (click)="handleToggleCollapse()">toggle</button>
              </div>
            </div>
          </div>
          <div ngProjectAs="collapse-body">
            <div>this is body</div>
          </div>
        </ui-collapse-panel>
      </ui-collapse>
    </div>
    <br />
    <br />
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CollapseComponent, CollapsePanelComponent],
})
export class CssGridComponent {
  active = signal(false);

  handleActiveChange(active: boolean) {
    // console.log(active);
  }

  handleToggleCollapse() {
    this.active.set(!this.active());
  }
}
