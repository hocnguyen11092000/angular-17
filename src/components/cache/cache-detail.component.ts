import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CachedService } from '../../services/cache.service';
import { PostApiService } from '../posts/post-api.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { IPost } from '../posts/post.interface';
import { LoadingWrapComponent } from '../loading-wrap/loading-wrap.component';

@Component({
  selector: 'app-cached-detail',
  template: `
    <h3>post detail</h3>
    <app-loading-wrap
      [loading]="(cachedData.loading$ | async)!"
      [fetching]="(cachedData.fetching$ | async)!"
    >
      @if(cachedData.data$ | async; as post) {
      <p>{{ post.title }}</p>
      }
    </app-loading-wrap>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, NgIf, LoadingWrapComponent],
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
    options: {
      syncUrl: true,
      url: `cache/${this.activatedRoute.snapshot.params['id']}`,
    },
  });
}
