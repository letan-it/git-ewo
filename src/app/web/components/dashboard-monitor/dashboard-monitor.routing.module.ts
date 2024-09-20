import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardMonitorComponent } from './dashboard-monitor.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardMonitorComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardMonitorRoutingModule { }
