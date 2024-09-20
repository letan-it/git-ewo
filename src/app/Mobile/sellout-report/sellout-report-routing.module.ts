import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelloutReportComponent } from './by_employee/sellout-report.component';
import { ByleaderComponent } from './byleader/byleader.component';
import { DetailByEmployeeComponent } from './byleader/detail-by-employee/detail-by-employee.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'sellout', component: SelloutReportComponent },
        { path: 'sellout-by-leader', component: ByleaderComponent },
        { path: 'sellout-detail-by-employee/:id', component: DetailByEmployeeComponent },
        {
            path: 'sellout',
            loadChildren: () =>
                import('./sellout-report.module').then(
                    (m) => m.SellOutReportModule
                ),
        },
    ])],
    exports: [RouterModule],

    
})
export class SellOutReportRoutingModule { }
