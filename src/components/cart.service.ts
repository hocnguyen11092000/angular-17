import { Injectable, signal } from '@angular/core';
import _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  carts$$ = signal<any>([]);
  quantity$$ = signal<number>(0);

  handleAddToCartService(product: unknown & { id: number }) {
    const indexCart = _.findIndex(
      this.carts$$(),
      (c) => _.get(c, 'id') === product.id
    );

    if (indexCart > -1) {
      const quantity = _.get(this.carts$$()[indexCart], 'quantity');

      _.set(this.carts$$()[indexCart], 'quantity', (quantity || 0) + 1);
    } else {
      this.carts$$.update((pre) => [...pre, { ...product, quantity: 1 }]);
    }

    if (product) {
      const quantity = _.reduce(
        this.carts$$(),
        (acc, curr) => acc + _.get(curr, 'quantity'),
        0
      );

      this.quantity$$.set(quantity);
    }
  }
}
