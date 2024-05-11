import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CachedService } from '../../services/cache.service';
import { PostApiService } from '../posts/post-api.service';
import { AsyncPipe } from '@angular/common';
import { IPost } from '../posts/post.interface';

@Component({
  selector: 'app-cached-detail',
  template: `
    <h3>post detail</h3>
    @if(cachedData.loading$ | async) {
    <p>loading...</p>
    } @if(cachedData.fetching$ | async) {
    <p>fetching...</p>
    } @if(cachedData.data$ | async; as post) {
    <p>{{ post.title }}</p>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class CachedDetailComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postApiService = inject(PostApiService);
  private readonly cachedService = inject(CachedService);

  cachedData = this.cachedService.withCached<IPost, {}>({
    queryKey: ['post-' + this.activatedRoute.snapshot.params['id']],
    queryFc: this.postApiService.getDetailPost.bind(this.postApiService),
    queryParams: {
      id: this.activatedRoute.snapshot.params['id'] + '',
    },
  });
}
