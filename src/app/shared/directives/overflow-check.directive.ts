import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appOverflowCheck]'
})
export class OverflowCheckDirective implements AfterViewInit {
  @Output() overflowChange = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => this.emitOverflowStatus());
  }

  private emitOverflowStatus() {
    const parentHeight = this.el.nativeElement.parentElement.clientHeight;
    const childHeight = this.el.nativeElement.clientHeight;
    const isOverflowing = childHeight > parentHeight;
    this.overflowChange.emit(isOverflowing);
  }
}
