import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupervisionComponent } from './supervision.component';
import { SubordinateListComponent } from './subordinate-list/subordinate-list.component';
import { StatisticalWorkdayComponent } from './statistical-workday/statistical-workday.component';
import { WorkdayDetailComponent } from './workday-detail/workday-detail.component';
import { MonthlyTimesheetComponent } from './monthly-timesheet/monthly-timesheet.component';
import { EmployeeSelloutListComponent } from './employee-sellout-list/employee-sellout-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SupervisionComponent },
        { path: 'subordinate-list', component: SubordinateListComponent },
        { path: 'statistical-workday', component: StatisticalWorkdayComponent },
        { path: 'workday-detail', component: WorkdayDetailComponent },
        { path: 'monthly-timesheet', component: MonthlyTimesheetComponent },
        { path: 'employee-sellout-list', component: EmployeeSelloutListComponent }
    ])],
    exports: [RouterModule],
})
export class SupervisionRoutingModule {}
