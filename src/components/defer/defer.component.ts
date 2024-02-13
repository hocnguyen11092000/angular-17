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

@Component({
  selector: 'app-defer',
  template: `
    <h3>hello from defer component</h3>
    <h3>{{ testService.name }}</h3>
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
  imports: [LargeComponent, CommonModule, CartComponent],
  // providers: [TestService],
})
export class DeferComponent implements OnInit {
  readonly testService = inject(TestService);

  ngOnInit(): void {
    // this.testService.setName('defer');
  }
}
