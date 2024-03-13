import { OverflowCheckDirective } from './overflow-check.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  template: `
    <div style="height: 100px;" appOverflowCheck (overflowChange)="onOverflowChange($event)">
      <p style="height: 150px;">Child</p>
    </div>
  `
})
class TestComponent {
  onOverflowChange(overflow: boolean) {}
}

describe('OverflowCheckDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, OverflowCheckDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should emit true when child overflows the parent', () => {
    const spy = jest.spyOn(component, 'onOverflowChange');

    fixture.detectChanges();

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(true);
    }, 0);
  });
});


