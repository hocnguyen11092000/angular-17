import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  //#region inject other services
  private readonly translateService = inject(TranslateService);
  //#endregion inject other services

  //#region functions
  hanleBootstrapTranslation() {
    this.translateService.addLangs(['en', 'vi']);
    this.translateService.setDefaultLang('vi');
    this.translateService.use('vi');
  }
  //#endregion functions
}
