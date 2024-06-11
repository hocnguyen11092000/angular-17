import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  viewChildren,
} from '@angular/core';
import { CollapseComponent } from '../../lib/collapse/collapse.component';
import { CollapsePanelComponent } from '../../lib/collapse/collapse-panel.component';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
import { ScrollHorizontalComponent } from '../scroll-horizontal/scroll-horizontal.component';

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
    <!-- <div class="scroll-container">
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
        <li>item 5</li>
        <li>item 6</li>
      </ul>
    </div> -->
    <div class="scroll-container">
      <app-scroll-horizontal
        [active]="data()[0]"
        [data]="data()"
      ></app-scroll-horizontal>
    </div>
    <br />
  `,
  styles: [
    `
      .scroll-container {
        max-width: 300px;
        border-radius: 4px;

        ul {
          list-style-type: none;
          display: flex;
          gap: 8px;
          flex-wrap: no-wrap;
          overflow: auto;

          li {
            border: 1px solid #c69;
            padding: 4px 12px;
            border-radius: 12px;
            text-wrap: nowrap;
            width: max-content;
          }
        }

        ul::-webkit-scrollbar {
          display: none;
        }
      }

      drag-scroll,
      .drag-container {
        width: 300px;
      }

      .drag-item {
        border: 1px solid #c69;
        padding: 4px 12px;
        border-radius: 12px;
        text-wrap: nowrap;
        width: max-content;
        margin-left: 8px;
      }

      :host {
        ::ng-deep {
          .drag-scroll-wrapper.drag-scroll-container {
            height: auto !important;
          }
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CollapseComponent,
    CollapsePanelComponent,
    DragScrollComponent,
    DragScrollItemDirective,
    ScrollHorizontalComponent,
  ],
})
export class CssGridComponent implements OnInit {
  @ViewChildren('dragItem') dragItems!: QueryList<ElementRef>;
  data = signal([
    {
      id: 1,
      name: 'item 1',
    },
    {
      id: 2,
      name: 'item 2',
    },
    {
      id: 3,
      name: 'item 3',
    },
    {
      id: 4,
      name: 'item 4',
    },
    {
      id: 5,
      name: 'item 5',
    },
    {
      id: 6,
      name: 'item 6',
    },
    {
      id: 7,
      name: 'item 7',
    },
    {
      id: 8,
      name: 'item 8',
    },
  ]);

  active = signal(false);

  ngOnInit(): void {}

  handleActiveChange(active: boolean) {
    // console.log(active);
  }

  handleToggleCollapse() {
    this.active.set(!this.active());
  }
}
