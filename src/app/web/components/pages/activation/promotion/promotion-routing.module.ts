import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PromotionComponent } from './promotion.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PromotionComponent }
    ])],
    exports: [RouterModule]
})
export class PromotionRoutingModule { }
