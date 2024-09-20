import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionComponent } from './promotion.component';

const routes: Routes = [
  {
    path: '', component: PromotionComponent,
  },
  {
    path: 'item',
    loadChildren: () =>
      import('./promo/promo.module').then((m) => m.PromoModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
