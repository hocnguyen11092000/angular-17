import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import _ from 'lodash';
import { NgForTrackByModule } from './custom-ngFor.module';

@Component({
  selector: 'app-large',
  template: `
    <button (click)="handleSetName()">set name</button>
    <!-- @for(item of users$$(); let i = $index; track item) {
    <div>{{ item.name }}</div>
    } -->

    <div *ngFor="let u of users; trackByProp: 'id'">
      <div>{{ u.name }}</div>
      <img width="500" [src]="u.img" alt="" />
    </div>
  `,
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgForTrackByModule],
})
export class LargeComponent implements OnInit, AfterViewInit {
  mockData$$ = signal(new Array(100000).fill(0));
  users$$ = signal([
    {
      id: 1,
      name: 'name 1',
      age: 18,
      img: 'assets/images/4k-image.jpg',
    },
    {
      id: 2,
      name: 'name 2',
      age: 20,
      img: 'assets/images/4k-image-2.jpg',
    },
  ]);

  users = [
    {
      id: 1,
      name: 'name 1',
      age: 18,
      img: 'assets/images/4k-image.jpg',
    },
    {
      id: 2,
      name: 'name 2',
      age: 20,
      img: 'assets/images/4k-image-2.jpg',
    },
  ];

  ngOnInit(): void {
    this.users$$.update((users) => {
      _.set(users, '0.name', Math.random().toString());

      return users;
    });
  }

  ngAfterViewInit(): void {}

  handleSetName() {
    // this.users$$.update((users) => {
    //   _.set(users, '0.name', Math.random().toString());

    //   return users;
    // });
    this.users = _.map(_.cloneDeep(this.users), (user) => {
      _.set(user, 'name', Math.random().toString());
      return user;
    });
  }

  track(index: number, item: unknown & { id: number }) {
    return item;
  }
}
