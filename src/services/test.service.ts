import { Injectable } from '@angular/core';

@Injectable()
export class TestService {
  name = 'test';

  setName(name: string) {
    this.name = name;
  }
}
