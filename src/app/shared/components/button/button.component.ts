import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input({ required: true }) text: string;
  @Input() icon: IconDefinition | undefined;
  @Output() clickBtn = new EventEmitter();

  _onClick(): void {
    this.clickBtn.emit();
  }
}
