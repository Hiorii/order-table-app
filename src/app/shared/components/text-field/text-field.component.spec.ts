import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextFieldComponent } from './text-field.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsFormControl } from '../../pipes/as-form-control.pipe';
import { NG_CONTROL_PROVIDER } from '../../testing/ng-control-provider.stub';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [TextFieldComponent, AsFormControl]
    })
      .overrideComponent(TextFieldComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct label and placeholder', () => {
    const label = 'Test Label';
    const placeholder = 'Test Placeholder';
    component.label = label;
    component.placeholder = placeholder;
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(labelElement.textContent).toContain(label);
    expect(inputElement.placeholder).toBe(placeholder);
  });

  it('should apply error styling when control is invalid and touched', () => {
    const control = component.ngControl.control as FormControl;
    control.setErrors({ required: true });
    control.markAsTouched();
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.classList.contains('border-danger')).toBe(true);
  });
});
