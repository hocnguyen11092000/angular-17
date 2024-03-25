import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { LargeComponent } from '../large/large.component';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../cart/cart.component';
import { TestService } from '../../services/test.service';
import { I18nService } from '../../services/i18n.service';
import { LangChangeEvent, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {
  finalize,
  switchMap,
  takeWhile,
  tap,
  withLatestFrom,
  of,
  startWith,
  map,
  defer,
} from 'rxjs';
import _ from 'lodash';

@Component({
  selector: 'app-defer',
  template: `
    <h3>hello from defer component</h3>
    <h3>{{ testService.name }}</h3>
    <h1>{{ 'HOME.TITLE' | translate }}</h1>
    <h1>{{ 'TEST' | translate }}</h1>
    <button #btn style="margin-bottom: 20px;">show component</button>
    @defer(on interaction(btn)) {
    <app-large>
      <app-cart></app-cart>
    </app-large>
    } @placeholder (minimum 500ms) {
    <p>Placeholder content</p>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LargeComponent, CommonModule, CartComponent, TranslateModule],
  // providers: [TestService],
})
export class DeferComponent implements OnInit {
  readonly testService = inject(TestService);
  private readonly i18Service = inject(I18nService);

  constructor(private http: HttpClient) {
    // const currentLang = this.i18Service.currentLang || 'vi';
    // this.http
    //   .get(`assets/i18n/custom-${currentLang}.json`)
    //   .pipe(
    //     tap((res) => {
    //       this.i18Service.setTranslation(currentLang, res, true);
    //     }),
    //     takeWhile((res) => {
    //       const translateJson = _.get(
    //         this.i18Service.store,
    //         `translations.${this.i18Service.currentLang}`
    //       );
    //       if (translateJson) {
    //         const keysResponse = _.keys(res) || [];
    //         if (
    //           _.size(_.intersection(_.keys(translateJson), keysResponse)) > 0
    //         ) {
    //           return false;
    //         }
    //       }
    //       return true;
    //     }),
    //     finalize(() => {
    //       console.log('this stream is completed');
    //     }),
    //     withLatestFrom(this.i18Service.getTranslation('vi'))
    //   )
    //   .subscribe((res) => {
    //     console.log(res, this.i18Service.store);
    //   });
  }

  ngOnInit(): void {
    this.i18Service.onLangChange
      .pipe(
        map((langEvent: LangChangeEvent) => langEvent.lang),
        startWith(this.i18Service.currentLang),
        switchMap((currentLang) =>
          defer(() =>
            this.http.get(`assets/i18n/custom-${currentLang}.json`).pipe(
              tap((res) => {
                this.i18Service.setTranslation(currentLang, res, true);
              }),
              takeWhile((res) => {
                const translateJson = _.get(
                  this.i18Service.store,
                  `translations.${this.i18Service.currentLang}`
                );

                if (translateJson) {
                  const keysResponse = _.keys(res) || [];

                  if (
                    _.size(
                      _.intersection(_.keys(translateJson), keysResponse)
                    ) > 0
                  ) {
                    return false;
                  }
                }

                return true;
              }),
              finalize(() => {
                console.log('this stream is completed');
              })
            )
          )
        )
      )
      .subscribe();
    // this.testService.setName('defer');
  }
}
