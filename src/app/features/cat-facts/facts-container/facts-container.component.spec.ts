import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactsContainerComponent } from './facts-container.component';

describe('FactsContainerComponent', () => {
  let component: FactsContainerComponent;
  let fixture: ComponentFixture<FactsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactsContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
