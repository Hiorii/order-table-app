import { Component, inject, OnInit } from '@angular/core';
import { OrdersTableViewModel } from './order-table.viewmodel';
import { EmptyOrderModel } from '../../../../shared/components/empty/models/empty-order.model';
import { faCloudArrowDown, faFaceSurprise } from '@fortawesome/free-solid-svg-icons';
import { ButtonModel } from '../../../../shared/components/button/models/button.model';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html'
})
export class OrdersTableComponent implements OnInit {
  public vm = inject(OrdersTableViewModel);
  orderGroups$ = this.vm.orderGroups$;
  headers$ = this.vm.headers$;
  emptyData: EmptyOrderModel = {
    icon: faFaceSurprise,
    title: 'Brak zleceń',
    details: 'Brak zleceń do wyświetlenia.'
  };
  buttonData: ButtonModel = {
    text: 'Załaduj zlecenia',
    icon: faCloudArrowDown
  };

  ngOnInit(): void {
    this.vm.loadOrders();
    this.vm.setupWebSocket();
  }
}
