import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IPost } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';

  private readonly http = inject(HttpClient);

  getAllPosts(path = '/posts') {
    return this.http.get<Array<IPost>>(this.baseUrl + path);
  }
}
