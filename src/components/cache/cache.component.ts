import {
  BasePagination,
  IBasePagination,
} from './../base-pagination/base-pagination';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostModel } from '../../models';
import { CachedService } from '../../services/cache.service';
import { PostApiService } from '../posts/post-api.service';
import { IPost } from '../posts/post.interface';
import { LoadingWrapComponent } from '../loading-wrap/loading-wrap.component';
import { PhotoApiService } from '../../services/photo-api-service';
import { IPhoto } from '../../interfaces';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cache',
  template: `
    <style>
      .pagination {
        display: flex;
        gap: 4px;
        margin: 12px 0;
      }

      .pagination li {
        border: 1px solid #ccc;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
      }

      .pagination li.active {
        background-color: #005e85;
        color: #fff;
      }
    </style>
    <h3>cache component</h3>
    <app-loading-wrap
      [loading]="(cachedPost2.loading$ | async)!"
      [fetching]="(cachedPost2.fetching$ | async)!"
    >
      @if(cachedPost2.data$ | async; as data) { @for (item of data; track
      $index){
      <p style="cursor: pointer;" [routerLink]="['/cache', item.id]">
        {{ item.title }}
      </p>
      } }
      <div>
        <button (click)="count = count + 1">{{ count }}</button>
        <button (click)="handleChangeStart()">change size</button>
        <button (click)="handleSearch()">search</button>
        <input
          type="text"
          placeholder="search..."
          [(ngModel)]="model$.value.title_like"
        />
      </div>
    </app-loading-wrap>
    <ul class="pagination">
      @for (item of pages; let i = $index; track i;) {
      <li (click)="handlePageChange(i + 1)" [class.active]="active(i)">
        {{ i + 1 }}
      </li>
      }
    </ul>
    <!-- @if(cachedPhoto.loading$ | async) {
    <div>photo loading...</div>
    } @if(cachedPhoto.fetching$ | async) {
    <div>photo fetching...</div>
    } @if(cachedPhoto.data$ | async; as data) { @for (item of data; track
    $index){
    <p style="cursor: pointer;" [routerLink]="['/cache', item.id]">
      {{ item.title }}
    </p>
    <img [src]="item.url" alt="" />
    } } -->
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, JsonPipe, FormsModule, LoadingWrapComponent],
  providers: [CachedService],
})
export class CacheComponent
  extends BasePagination<PostModel>
  implements OnInit
{
  private readonly postApiService = inject(PostApiService);
  private readonly cachedService = inject(CachedService);
  private readonly photoApiService = inject(PhotoApiService);

  override model$ = new BehaviorSubject<PostModel>(new PostModel(null));
  pages = new Array(10);

  cachedPost = this.cachedService.withCached<Array<IPost>, PostModel>({
    queryKey: ['post'],
    queryFc: this.postApiService.getAllPosts.bind(this.postApiService),
    queryParams: this.model$.value,
  });

  cachedPost2 = this.cachedService.withCached<Array<IPost>, PostModel>({
    queryKey: ['post-2'],
    queryFc: this.postApiService.getAllPosts.bind(this.postApiService),
    queryParams: this.model$,
    options: {
      syncUrl: true,
      url: 'cache',
    },
  });

  cachedPhoto = this.cachedService.withCached<Array<IPhoto>, PostModel>({
    queryKey: ['photo'],
    queryFc: this.photoApiService.getAllPhotos.bind(this.photoApiService),
    queryParams: this.model$.value,
  });
  count = 0;

  handleChangeStart() {
    this.model$.next({
      ...this.model$.getValue(),
      _start: this.model$.value._start + 5,
    });
  }

  handleSearch() {
    this.model$.next({
      ...this.model$.getValue(),
    });
  }

  ngOnInit(): void {
    // this.cachedPost2.data$.subscribe(console.log);
  }

  active(index: number) {
    const model = this.model$.getValue();

    if (model._start === 0) {
      return model._start === index;
    }

    return model._start / model._limit === index + 1;
  }
}
