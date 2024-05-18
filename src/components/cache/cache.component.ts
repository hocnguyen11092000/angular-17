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
    <h3>cache component</h3>
    <app-loading-wrap
      [loading]="(cachedPost.loading$ | async)!"
      [fetching]="(cachedPost.fetching$ | async)!"
    >
      @if(cachedPost.data$ | async; as data) { @for (item of data; track
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
          [(ngModel)]="model.title_like"
        />
      </div>
    </app-loading-wrap>

    @if(cachedPhoto.loading$ | async) {
    <div>photo loading...</div>
    } @if(cachedPhoto.fetching$ | async) {
    <div>photo fetching...</div>
    } @if(cachedPhoto.data$ | async; as data) { @for (item of data; track
    $index){
    <p style="cursor: pointer;" [routerLink]="['/cache', item.id]">
      {{ item.title }}
    </p>
    <img [src]="item.url" alt="" />
    } }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, JsonPipe, FormsModule, LoadingWrapComponent],
  providers: [CachedService],
})
export class CacheComponent implements OnInit {
  private readonly postApiService = inject(PostApiService);
  private readonly cachedService = inject(CachedService);
  private readonly photoApiService = inject(PhotoApiService);

  model = new PostModel(null);
  model$ = new BehaviorSubject<PostModel>(this.model);

  cachedPost = this.cachedService.withCached<Array<IPost>, PostModel>({
    queryKey: ['post'],
    queryFc: this.postApiService.getAllPosts.bind(this.postApiService),
    queryParams: this.model,
  });

  cachedPost2 = this.cachedService.withCached<Array<IPost>, PostModel>({
    queryKey: ['post'],
    queryFc: this.postApiService.getAllPosts.bind(this.postApiService),
    queryParams: this.model$,
  });

  cachedPhoto = this.cachedService.withCached<Array<IPhoto>, PostModel>({
    queryKey: ['photo'],
    queryFc: this.photoApiService.getAllPhotos.bind(this.photoApiService),
    queryParams: this.model,
    options: {
      syncUrl: true,
      url: 'cache',
    },
  });
  count = 0;

  handleChangeStart() {
    this.model._start = this.model._start + 5;
    this.model$.next({
      ...this.model$.getValue(),
      _start: this.model$.value._start + 5,
    });
  }

  handleSearch() {}

  ngOnInit(): void {
    this.cachedPost2.data$.subscribe(console.log);
  }
}
