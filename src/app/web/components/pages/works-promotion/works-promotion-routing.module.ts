import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksPromotionComponent } from './works-promotion.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksPromotionComponent }
    ])],
    exports: [RouterModule]
})
export class WorksPromotionRoutingModule { }
