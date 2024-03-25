import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  template: `
    <h3>post component</h3>
    <article *ngFor="let post of post$ | async">
      <h2 class="post-title">{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </article>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PostComponent {
  private readonly postService = inject(PostService);

  readonly post$ = this.postService.getAllPosts();
}
