import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'showFileName',
  standalone: true,
})
export class ShowFileNamePipe implements PipeTransform {
  transform(value: unknown, maxlength?: number): string {
    if (!value) return '';

    const maxLength = maxlength || 10;

    //ignore last element
    const fileName = _.initial((value + '').split('.')) + '';

    const fileExtension = (value + '').split('.').at(-1);
    const sliceFilename =
      _.size(fileName) > maxLength
        ? fileName.slice(0, maxLength) + '..'
        : fileName;

    return sliceFilename + '.' + fileExtension;
  }
}
