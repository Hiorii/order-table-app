import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { ButtonDirective } from './button.directive';
import { IconComponent } from '../icon/icon.component';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  template: ` <button appButton [appButtonText]="text" [appButtonIcon]="icon"></button>`
})
class TestHostComponent {
  text: string | null = 'Click me';
  icon: IconDefinition = faCoffee;
}

describe('ButtonDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let buttonElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, ButtonDirective, IconComponent],
      imports: [FontAwesomeModule],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.debugElement.query(By.directive(ButtonDirective)).nativeElement;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directiveInstance = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
    expect(directiveInstance).toBeTruthy();
  });

  it('should apply the correct classes to the button', () => {
    expect(buttonElement.className).toContain(
      'bg-background flex font-semibold h-full items-center justify-center p-4 pl-12 pr-12 rounded-2xl text-text text-xl w-full'
    );
  });

  it('should update text content on changes', () => {
    component.text = 'New Text';
    fixture.detectChanges();
    const directiveInstance = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
    directiveInstance.ngOnChanges({
      appButtonText: new SimpleChange('Click me', 'New Text', false)
    });
    fixture.detectChanges();
    expect(buttonElement.textContent).toContain('New Text');
  });

  it('should update icon on changes', () => {
    component.icon = faCoffee;
    fixture.detectChanges();
    const directiveInstance = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
    directiveInstance.ngOnChanges({
      appButtonIcon: new SimpleChange(null, faCoffee, false)
    });
    fixture.detectChanges();
    const iconElement = buttonElement.querySelector('fa-icon');
    expect(iconElement).toBeTruthy();
  });

  it('should remove old icon when updating to a new one', () => {
    component.icon = faCoffee;
    fixture.detectChanges();
    const directiveInstance = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
    directiveInstance.ngOnChanges({
      appButtonIcon: new SimpleChange(null, faCoffee, false)
    });
    fixture.detectChanges();

    directiveInstance.ngOnChanges({
      appButtonIcon: new SimpleChange(faCoffee, faCoffee, false)
    });
    fixture.detectChanges();

    const iconElements = buttonElement.querySelectorAll('fa-icon');
    expect(iconElements.length).toBe(1);
  });
});
