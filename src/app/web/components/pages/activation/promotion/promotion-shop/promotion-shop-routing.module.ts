import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PromotionShopComponent } from './promotion-shop.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PromotionShopComponent }
    ])],
    exports: [RouterModule]
})
export class PromotionShopRoutingModule { }
