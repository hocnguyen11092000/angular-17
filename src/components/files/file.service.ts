import { Injectable } from '@angular/core';
import { Observable, delay, filter, map, of } from 'rxjs';
import { BaseApiClient } from '../../api/base-api-client';
import { ApiConfiguration } from '../../api/api-configuration';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { IUploadFileResponse } from './file.interface';
import { StrictHttpResponse } from '../../api/strict-http-response';
import { RequestBuilder } from '../../api/request-builder';

@Injectable()
export class FileService extends BaseApiClient {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  uploadFile(fileName: string): Observable<Record<string, unknown>> {
    return of({
      name: fileName,
      id: Date.now().toString(),
    }).pipe(delay(1000));
  }

  static readonly upload = '/files/upload';
  upload$Response(
    params: {
      /**
       * Article to create
       */
      body: {
        file: File;
      };
    },
    context?: HttpContext
  ): Observable<
    StrictHttpResponse<{
      file: IUploadFileResponse;
    }>
  > {
    const rb = new RequestBuilder(
      'https://api.escuelajs.co/api/v1',
      FileService.upload,
      'post'
    );
    if (params) {
      rb.body(params.body, 'multipart/form-data');
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
          return r as StrictHttpResponse<{
            file: IUploadFileResponse;
          }>;
        })
      );
  }

  upload(
    params: {
      /**
       * Article to create
       */
      body: {
        file: File;
      };
    },
    context?: HttpContext
  ): Observable<{
    file: IUploadFileResponse;
  }> {
    return this.upload$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<{
            file: IUploadFileResponse;
          }>
        ) =>
          r.body as {
            file: IUploadFileResponse;
          }
      )
    );
  }
}
