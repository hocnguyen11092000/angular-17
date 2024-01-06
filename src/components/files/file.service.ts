import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

@Injectable()
export class FileService {
  uploadFile(fileName: string): Observable<Record<string, unknown>> {
    return of({
      name: fileName,
      id: Date.now().toString(),
    }).pipe(delay(1000));
  }
}
