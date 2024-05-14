import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-wrap',
  template: `
    <div *ngIf="loading" class="loading-circle-wrap">
      <span class="loader-circle"></span>
    </div>

    <div [class.hidden]="!fetching" class="loading-bar-wrap">
      <span class="loader-bar"></span>
    </div>

    <div *ngIf="!loading">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrl: './loading-wrap.component.scss',
  imports: [NgIf],
})
export class LoadingWrapComponent {
  @Input() loading: boolean = false;
  @Input() fetching: boolean = false;
}
