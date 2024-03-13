import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { By } from '@angular/platform-browser';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply input properties', () => {
    component.buttonType = 'submit';
    component.buttonTitle = 'Submit';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button')).nativeElement;

    expect(button.type).toBe('submit');
    expect(button.textContent.trim()).toBe('Submit');
  });

  it('should emit onBtnClick event on button click', () => {
    jest.spyOn(component.onBtnClick, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);

    expect(component.onBtnClick.emit).toHaveBeenCalled();
  });
});
