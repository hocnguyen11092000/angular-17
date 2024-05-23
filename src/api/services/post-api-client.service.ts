import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { IPostQueryParams } from '../../interfaces';
import { ApiConfiguration } from '../api-configuration';
import { BaseApiClient } from '../base-api-client';
import { RequestBuilder } from '../request-builder';
import { StrictHttpResponse } from '../strict-http-response';
import { IPost } from './../../components/posts/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostApiClient extends BaseApiClient {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  static readonly GetPosts = '/posts';

  getPosts$Response(
    params?: Partial<IPostQueryParams>,
    context?: HttpContext
  ): Observable<
    StrictHttpResponse<{
      posts: Array<IPost>;
    }>
  > {
    const rb = new RequestBuilder(this.rootUrl, PostApiClient.GetPosts, 'get');
    if (params) {
      rb.query('_start', params._start, {});
      rb.query('_limit', params._limit, {});
      rb.query('_total_like', params.title_like, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
          context: context,
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          console.log(r);

          return r as StrictHttpResponse<{
            posts: Array<IPost>;
          }>;
        })
      );
  }

  getPosts(
    params?: Partial<IPostQueryParams>,
    context?: HttpContext
  ): Observable<{
    posts: Array<IPost>;
  }> {
    return this.getPosts$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<{
            posts: Array<IPost>;
          }>
        ) =>
          r.body as {
            posts: Array<IPost>;
          }
      )
    );
  }
}
