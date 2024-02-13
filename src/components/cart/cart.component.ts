import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import _ from 'lodash';
import { CartService } from './cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-cart',
  template: `
    <style>
      .product {
        margin: 8px;
      }

      .product-container {
        display: flex;
        gap: 4px;

        .product {
          flex: 1;
        }
      }
    </style>

    <h2>hello from cart component</h2>
    <header>
      <div class="header">
        {{ cartServices.quantity$$() }}
      </div>
    </header>

    <i>{{ testService.name }}</i>
    <div class="product-container">
      @for (item of products$$(); let idx = $index; track idx) {
      <div class="product">
        <img [src]="item.img" alt="" width="120" />
        <div>
          <span>{{ item.name }}</span>
        </div>
        <div>
          <span>{{ item.price }}</span>
        </div>
        <button (click)="handleAddToCart(item)">add to cart</button>
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CartComponent implements OnInit {
  isChanged = true;

  @HostListener('window:beforeunload', ['$event'])
  doSomething(event: BeforeUnloadEvent) {
    if (this.isChanged) {
      event.preventDefault();
    }
  }

  //#region signals
  products$$ = signal([
    {
      id: 1,
      name: 'iphone 15 pro max',
      price: 35,
      img: 'data:image/jpeg;base64,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',
    },
    {
      id: 2,
      name: 'sam sung galaxy s23 ultra',
      price: 25,
      img: 'data:image/jpeg;base64,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',
    },
  ]);
  //#endregion signals

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(console.log);
    this.router.navigate(['.'], {
      queryParams: { test: 'âfafaf' },
      relativeTo: this.activateRoute,
    });
  }

  //#region inject services
  readonly cartServices = inject(CartService);
  private readonly activateRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly testService = inject(TestService);
  //#endregion inject services

  handleAddToCart(item: any) {
    if (_.size(item)) {
      this.cartServices.handleAddToCartService(item);
    }
  }
}
