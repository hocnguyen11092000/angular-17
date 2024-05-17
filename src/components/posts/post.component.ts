import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseListComponent } from '../../shared/components/base-list/base-list.component';
import { PostModel } from '../../models';
import { PostApiService } from './post-api.service';
import { IPost } from './post.interface';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-post',
  template: `
    <h3>post</h3>
    <input type="text" [(ngModel)]="model.title_like" />
    <button (click)="handleSearch(model.title_like)">search</button>
    <button (click)="handleRefresh()">refresh</button>
    <button (click)="handleReset(defaultModel)">reset</button>
    @for(item of data$ | async; track $index) {
    <div>{{ item.title }}</div>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AsyncPipe],
})
export class PostComponent extends BaseListComponent<PostModel, IPost> {
  private readonly postApiService = inject(PostApiService);
  get defaultModel() {
    return new PostModel(null);
  }

  override model: PostModel = this.defaultModel;
  override getList = this.postApiService.getAllPosts.bind(this.postApiService);
  override debounceTime: number = 0;

  override ngOnChildrenInit(): void {
    this.model = new PostModel(this.defaultUrlQueryParams);
    this.handleRefresh();
  }
}
