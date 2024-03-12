import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
  name: 'asFormControl'
})
export class AsFormControl implements PipeTransform {
  transform(value: AbstractControl | null): FormControl {
    if (value === null || !(value instanceof FormControl)) {
      throw new Error('Control is null or not an instance of FormControl');
    }
    return value;
  }
}
