import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IPhoto } from '../interfaces';
@Injectable({
  providedIn: 'root',
})
export class PhotoApiService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
  private readonly http = inject(HttpClient);

  getAllPhotos(queryParams: any): Observable<Array<IPhoto>> {
    const path = '/photos';

    return this.http.get<Array<IPhoto>>(this.baseUrl + path, {
      params: queryParams,
    });
  }
}
