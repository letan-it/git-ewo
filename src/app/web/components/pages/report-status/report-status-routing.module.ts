import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportStatusComponent } from './report-status.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReportStatusComponent }
    ])],
    exports: [RouterModule]
})
export class ReportStatusRoutingModule {
    constructor() {

    }
}
