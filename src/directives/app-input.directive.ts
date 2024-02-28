import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appInput]',
  exportAs: 'appInput',
  standalone: true,
})
export class AppInputDirective implements OnInit {
  //#region inject services
  private readonly nativeElm = inject(ElementRef).nativeElement!;
  //#endregion inject services

  ngOnInit(): void {
    // console.log('run...', this.nativeElm);
  }
}
