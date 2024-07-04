import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { By } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TableHeader } from './models/table-header.model';
import { BaseTableData } from './models/base-table-data.model';
import { Component } from '@angular/core';
import { TableData } from './models/table-data.model';
import { DisplayValuePipe } from '../../pipes/display-value.pipe';
import { OrderSideEnum } from '../../../core/enums/order-side.enum';
import { OrderSymbol } from '../../../features/orders/enums/order-symbol.enum';

interface TestTableData extends BaseTableData {
  symbol: OrderSymbol;
  id: number;
  side: string;
  size: number;
  openTime: number;
  openPrice: number;
  swap: number;
  profit: number;
}

@Component({
  selector: 'app-test-host',
  template: ` <app-table [headers]="headers" [data]="data" (actionTriggered)="onActionTriggered($event)"></app-table>`
})
class TestHostComponent {
  headers: TableHeader[] = [
    { id: 'symbol', name: 'Symbol' },
    { id: 'side', name: 'Side' },
    {
      id: 'actions',
      name: '',
      isAction: true,
      mainActions: [
        {
          icon: faTrash,
          name: 'removeGroup',
          click: (group: BaseTableData) => this.onActionTriggered({ action: 'removeGroup', item: group })
        }
      ]
    }
  ];
  data: TableData<TestTableData>[] = [
    {
      symbol: OrderSymbol.BTCUSD,
      id: 1,
      side: OrderSideEnum.BUY,
      size: 100,
      openTime: 1629292929000,
      openPrice: 150,
      swap: 0,
      profit: 100,
      children: []
    },
    {
      symbol: OrderSymbol.ETHUSD,
      id: 2,
      side: OrderSideEnum.SELL,
      size: 50,
      openTime: 1629292929000,
      openPrice: 2800,
      swap: 0,
      profit: 200,
      children: []
    }
  ];

  onActionTriggered(_: { action: string; item: BaseTableData }) {}
}

describe('TableComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent, IconComponent, TestHostComponent, DisplayValuePipe],
      imports: [FontAwesomeModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should set headers input', () => {
    const headerElements = fixture.debugElement.queryAll(By.css('th'));
    expect(headerElements.length).toBe(hostComponent.headers.length);
    expect(headerElements[0].nativeElement.textContent).toContain('Symbol');
    expect(headerElements[1].nativeElement.textContent).toContain('Side');
  });

  it('should set data input and add arrowIcon', () => {
    hostComponent.data = hostComponent.data.map((item) => ({
      ...item,
      arrowIcon: faChevronDown
    }));
    fixture.detectChanges();
    expect(hostComponent.data.length).toBe(2);
    expect(hostComponent.data[0].arrowIcon).toBe(faChevronDown);
  });

  it('should toggle group on click and change arrow icon', () => {
    const tableComponent = fixture.debugElement.query(By.directive(TableComponent)).componentInstance as TableComponent<TestTableData>;

    jest.spyOn(tableComponent, 'toggleGroup');

    tableComponent.toggleGroup(OrderSymbol.BTCUSD);
    fixture.detectChanges();

    expect(tableComponent.expandedGroups.has(OrderSymbol.BTCUSD)).toBe(true);
    expect(tableComponent._data[0].arrowIcon).toBe(faChevronUp);
    expect(tableComponent.toggleGroup).toHaveBeenCalledWith(OrderSymbol.BTCUSD);

    tableComponent.toggleGroup(OrderSymbol.BTCUSD);
    fixture.detectChanges();

    expect(tableComponent.expandedGroups.has(OrderSymbol.BTCUSD)).toBe(false);
    expect(tableComponent._data[0].arrowIcon).toBe(faChevronDown);
  });
});
