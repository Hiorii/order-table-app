import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationMessageComponent } from './validation-message.component';

describe('ValidationMessageComponent', () => {
  let component: ValidationMessageComponent;
  let fixture: ComponentFixture<ValidationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidationMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ValidationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided message', () => {
    const testMessage = 'Test validation message';
    component.message = testMessage;
    fixture.detectChanges();

    const messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement).not.toBeNull();
    expect(messageElement.textContent).toContain(testMessage);
  });

  it('should not display the message paragraph when message is undefined', () => {
    fixture.detectChanges();
    let messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement).toBeNull();

    component.message = '';
    fixture.detectChanges();
    messageElement = fixture.nativeElement.querySelector('p');
    expect(messageElement).toBeNull();
  });
});
