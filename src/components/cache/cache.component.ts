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

@Component({
  selector: 'app-cache',
  template: `
    <h3>cache component</h3>
    @if(cachedData.loading$ | async) {
    <p>loading...</p>
    } @if(cachedData.fetching$ | async) {
    <p>fetching...</p>
    } @if(cachedData.data$ | async; as data) { @for (item of data; track
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
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, JsonPipe, FormsModule],
})
export class CacheComponent implements OnInit {
  private readonly postApiService = inject(PostApiService);
  private readonly cachedService = inject(CachedService);

  model = new PostModel(null);
  cachedData = this.cachedService.withCached<Array<IPost>, PostModel>({
    queryKey: ['post'],
    queryFc: this.postApiService.getAllPosts.bind(this.postApiService),
    queryParams: this.model,
    options: {
      syncUrl: true,
      url: 'cache',
    },
  });
  count = 0;

  handleChangeStart() {
    this.model._start = this.model._start + 5;

    this.cachedData.changeModel(this.model);
  }

  handleSearch() {
    this.cachedData.changeModel(this.model);
  }

  ngOnInit(): void {}
}
