import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardReportComponent } from './dashboard-report.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardReportComponent },
    ])],
    exports: [RouterModule],
})
export class DashboardReportRoutingModule {}
