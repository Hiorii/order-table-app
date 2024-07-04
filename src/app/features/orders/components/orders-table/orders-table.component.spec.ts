import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersTableComponent } from './orders-table.component';
import { OrdersTableViewModel } from './order-table.viewmodel';
import { OrderService } from '../../services/order.service';
import { of } from 'rxjs';
import { OrderGroup } from '../../models/order-group.model';
import { TableHeader } from '../../../../shared/components/table/models/table-header.model';
import { EmptyOrderModel } from '../../../../shared/components/empty/models/empty-order.model';
import { ButtonModel } from '../../../../shared/components/button/models/button.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudArrowDown, faFaceSurprise } from '@fortawesome/free-solid-svg-icons';
import { EmptyComponent } from '../../../../shared/components/empty/empty.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { ButtonDirective } from '../../../../shared/components/button/button.directive';

describe('OrdersTableComponent', () => {
  let component: OrdersTableComponent;
  let fixture: ComponentFixture<OrdersTableComponent>;
  let viewModel: jest.Mocked<OrdersTableViewModel>;

  beforeEach(async () => {
    const viewModelMock = {
      orderGroups$: of([] as OrderGroup[]),
      headers$: of([] as TableHeader[]),
      loadOrders: jest.fn(),
      setupWebSocket: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [OrdersTableComponent, EmptyComponent, IconComponent, ButtonDirective],
      providers: [{ provide: OrdersTableViewModel, useValue: viewModelMock }, OrderService],
      imports: [FontAwesomeModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersTableComponent);
    component = fixture.componentInstance;
    viewModel = TestBed.inject(OrdersTableViewModel) as jest.Mocked<OrdersTableViewModel>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load orders and setup WebSocket on init', () => {
    component.ngOnInit();
    expect(viewModel.loadOrders).toHaveBeenCalled();
    expect(viewModel.setupWebSocket).toHaveBeenCalled();
  });

  it('should display empty state when there are no order groups', () => {
    const compiled = fixture.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('app-empty')).toBeTruthy();
  });

  it('should call loadOrders when button is clicked', () => {
    jest.spyOn(component.vm, 'loadOrders');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.vm.loadOrders).toHaveBeenCalled();
  });

  it('should have correct empty data and button data', () => {
    expect(component.emptyData).toEqual({
      icon: faFaceSurprise,
      title: 'Brak zleceń',
      details: 'Brak zleceń do wyświetlenia.'
    } as EmptyOrderModel);

    expect(component.buttonData).toEqual({
      text: 'Załaduj zlecenia',
      icon: faCloudArrowDown
    } as ButtonModel);
  });
});
