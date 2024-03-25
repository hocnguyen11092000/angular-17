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
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { takeWhile, tap, withLatestFrom } from 'rxjs';

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
    this.http
      .get('assets/i18n/custom.json')
      .pipe(
        tap((res) => {
          this.i18Service.setTranslation('vi', res, true);
        }),
        withLatestFrom(this.i18Service.getTranslation('vi'))
      )
      .subscribe((res) => {
        console.log(res, this.i18Service.store);
      });
  }

  ngOnInit(): void {
    // this.testService.setName('defer');
  }
}
