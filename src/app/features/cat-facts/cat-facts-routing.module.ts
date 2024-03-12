import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactsContainerComponent } from './facts-container/facts-container.component';

const routes: Routes = [
  { path: '', component: FactsContainerComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatFactsRoutingModule {}
