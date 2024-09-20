import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardSelloutComponent } from './dashboard-sellout.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardSelloutComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardSelloutRoutingModule { }
