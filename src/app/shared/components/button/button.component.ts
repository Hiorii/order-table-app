import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input({ required: true }) buttonType: string = 'primary';
  @Input({ required: true }) buttonTitle: string = 'click';
  @Input() isDisabled: boolean = false;
  @Input() width: string = 'full';
  @Output() btnClick: EventEmitter<MouseEvent> = new EventEmitter();

  onBtnClicked(event: MouseEvent) {
    this.btnClick.emit(event);
  }
}
