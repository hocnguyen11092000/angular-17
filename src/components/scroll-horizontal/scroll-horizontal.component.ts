import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
export interface IScrollData {
  id: string | number;
  name: string;
}

@Component({
  selector: 'app-scroll-horizontal',
  template: `
    <!-- <drag-scroll [scrollbar-hidden]="true"> -->
    <div class="scroll-container">
      <ul>
        @for(item of data() || []; track $index) {
        <li
          [class.active]="item.id === active()?.id"
          #ref
          (click)="handleSetActive(item, ref)"
          class="drag-item"
        >
          {{ item.name }}
        </li>
        }
      </ul>
    </div>
    <!-- </drag-scroll> -->
  `,
  styles: [
    `
      .scroll-container {
        max-width: 100%;
        overflow: auto;
        scroll-behavior: smooth;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .drag-item {
        border: 1px solid #c69;
        padding: 4px 12px;
        border-radius: 12px;
        text-wrap: nowrap;
        width: max-content;
        margin-left: 8px;
        cursor: pointer;
        list-style: none;

        &.active {
          background: #c69;
          color: #fff;
        }
      }

      ul {
        display: flex;
        gap: 8px;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DragScrollComponent, DragScrollItemDirective],
})
export class ScrollHorizontalComponent<T extends IScrollData> {
  data = input.required();
  active = model<T | null>(null);

  handleSetActive(item: T, ref: HTMLElement) {
    this.active.set(item);

    if (ref) {
      ref.scrollIntoView({
        inline: 'center',
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }
}
