import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class I18nService extends TranslateService {
  //#region functions
  hanleBootstrapTranslation() {
    this.addLangs(['en', 'vi']);
    this.setDefaultLang('vi');
    this.use('vi');
  }
  //#endregion functions
}
