import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SummaryWorkshiftComponent } from './summary-workshift.component';
import { ReportWorkshiftComponent } from './report-workshift/report-workshift.component';
import { ReportSummaryByDateComponent } from './report-summary-by-date/report-summary-by-date.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SummaryWorkshiftComponent },
        { path: 'report-workshift', component: ReportWorkshiftComponent },
        { path: 'report-summary-by-date', component: ReportSummaryByDateComponent }
    ])],
    exports: [RouterModule],
})
export class SummaryWorkshiftRoutingModule {}
