import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { CatFactsService } from '../services/cat-facts.service';
import { FactsContainerComponent } from './facts-container.component';

describe('FactsContainerComponent', () => {
  let component: FactsContainerComponent;
  let fixture: ComponentFixture<FactsContainerComponent>;
  let catFactsServiceMock: Partial<CatFactsService>;
  let authenticationServiceMock: Partial<AuthenticationService>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    catFactsServiceMock = {
      fetchFacts: jest.fn().mockReturnValue(of(['Fact 1', 'Fact 2'])) as jest.Mock
    };

    authenticationServiceMock = {
      logout: jest.fn() as jest.Mock
    };

    routerMock = {
      navigate: jest.fn() as jest.Mock
    };

    await TestBed.configureTestingModule({
      declarations: [FactsContainerComponent],
      providers: [
        { provide: CatFactsService, useValue: catFactsServiceMock },
        { provide: AuthenticationService, useValue: authenticationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FactsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load facts on init', (done) => {
    component.facts$.subscribe((facts) => {
      expect(facts.length).toBeGreaterThan(0);
      expect(facts).toEqual(['Fact 1', 'Fact 2']);
      done();
    });
  });

  it('should call fetchFacts when loadMoreFacts is called', () => {
    component.loadMoreFacts();
    expect(catFactsServiceMock.fetchFacts).toHaveBeenCalled();
  });

  it('should logout when logout method is called', () => {
    component.logout();
    expect(authenticationServiceMock.logout).toHaveBeenCalled();
  });
});
