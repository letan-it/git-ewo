import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { TimekeepingReportComponent } from './timekeeping-report.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: TimekeepingReportComponent }])],
    exports: [RouterModule],
})
export class TimekeepingReportRoutingModule {}
