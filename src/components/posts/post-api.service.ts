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

  getAllPosts(path = '/posts', queryParams: any): Observable<Array<IPost>> {
    console.log(this.baseUrl + path);

    return this.http.get<Array<IPost>>(this.baseUrl + path, {
      params: queryParams,
    });
  }
}
