import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardAtdComponent } from './dashboard-atd.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardAtdComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardAtdRoutingModule { }
