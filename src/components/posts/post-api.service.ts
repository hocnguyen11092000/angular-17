import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from './post.interface';
import { HttpClient } from '@angular/common/http';
import { PostModel } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class PostApiService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
  private readonly http = inject(HttpClient);

  getAllPosts(queryParams: any): Observable<Array<IPost>> {
    const path = '/posts';

    return this.http.get<Array<IPost>>(this.baseUrl + path, {
      params: queryParams,
    });
  }

  getDetailPost(queryParams: any): Observable<IPost> {
    const { id } = queryParams;

    const path = '/posts/' + id;

    return this.http.get<IPost>(this.baseUrl + path);
  }
}
