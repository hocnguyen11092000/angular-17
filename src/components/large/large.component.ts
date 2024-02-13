import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import _ from 'lodash';
import { NgForTrackByModule } from './custom-ngFor.module';
import { fromEvent, tap } from 'rxjs';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-large',
  template: `
    <button (click)="handleSetName()">set name</button>
    <ng-content></ng-content>
    <!-- @for(item of users$$(); let i = $index; track item) {
    <div>{{ item.name }}</div>
    } -->

    <div *ngFor="let u of users">
      <div>{{ u.name }}</div>
      <img width="500" [src]="u.img" alt="" />

      <button #btn (click)="delete(u.id)">delete</button>
    </div>
    <button (click)="add()">add</button>
    <button (click)="mutate()">mutate array</button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgForTrackByModule],
  viewProviders: [TestService], // view providers not resolve DI with ng-content
})
export class LargeComponent implements OnInit, AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  readonly testService = inject(TestService);

  @ViewChild('btn', { static: false }) btn!: ElementRef;

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
    this.testService.setName('large');

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
    this.users = _.map(this.users, (user, index) => {
      if (index === 0) {
        _.set(user, 'name', Math.random().toString());
      }

      return user;
    });
  }

  trackIndex(index: number, item: unknown & { id: number; name: string }) {
    return;
  }

  delete(id: number): void {
    this.users = [...this.users.filter((user) => user.id !== id)];
  }

  add() {
    this.users.push({
      id: Math.random(),
      name: Math.random() + '',
      age: 20,
      img: 'assets/images/4k-image-2.jpg',
    });
  }

  mutate() {
    this.users = _.cloneDeep(this.users);
  }
}
