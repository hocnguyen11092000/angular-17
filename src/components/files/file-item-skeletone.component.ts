import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ShowFileNamePipe } from '../../pipes/show-file-name.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-file-item-skeleton',
  template: `
    <style>
      .upload-processing {
        display: flex;
        gap: 16px;
        border-radius: 4px;
        padding: 8px;
        width: 100%;
      }

      .file-item {
        position: relative;
        z-index: 1;
        display: flex;
        padding: 8px;
        width: 100%;
        background-color: #f6f6fb;
        border-radius: 4px;
        gap: 4px;
        min-height: 96px;
      }

      .processing {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: #0000000f;
        border-radius: 4px;
      }

      .file-image {
        position: relative;
        z-index: -1;
      }

      .loading-wrap {
        width: 100%;
        margin-left: -12px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .file-name {
        margin-top: 8px;
      }

      .file-desc {
        display: flex;
        gap: 8px;
        flex-direction: column;

        font-size: 13px;
      }
    </style>
    <div class="upload-processing">
      <div class="file-item">
        <img
          class="file-image"
          src="https://hdi-hpcms.test.finos.asia/wp-content/themes/finos-hdi/images/home5/doc-green.png"
          alt=""
          width="80"
        />
        <div class="file-desc" *ngIf="item?.['name'] || item?.['originalname']">
          <div
            class="file-name"
            [tooltip]="(item?.['name'] || item?.['originalname']) + ''"
          >
            {{(item?.['name'] || item?.['originalname'] ||  '') | showFileName}}
          </div>
          <div class="file-download">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V12H4V19Z"
                fill="#BB8A0B"
              ></path>
            </svg>
            <span>Tải tài liệu</span>
          </div>
        </div>
        <ng-container *ngIf="!item">
          <div class="loading-wrap">
            <div class="spinner-border" role="status"></div>
            <div class="processing"></div>
          </div>
        </ng-container>
        <div
          (click)="oDeleteitem.emit(item['name'])"
          class="delete-icon ml-3"
          style="cursor: pointer;"
          *ngIf="item"
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ShowFileNamePipe, TooltipModule],
})
export class FileItemSkeleton {
  @Input() count: number = 0;
  @Input() item!: Record<string, unknown> | undefined;

  @Output() oDeleteitem = new EventEmitter<unknown>();
}
