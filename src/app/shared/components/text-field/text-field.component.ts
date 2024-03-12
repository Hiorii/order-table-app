import { Component, Input, Self } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { NOOP_VALUE_ACCESSOR } from '../../utilities/no-op-value-accessor';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useValue: NOOP_VALUE_ACCESSOR,
      multi: true
    }
  ]
})
export class TextFieldComponent {
  @Input() label: string;
  @Input() placeholder = '';
  @Input({ required: true }) type = 'text';

  constructor(@Self() public ngControl: NgControl) {}
}
