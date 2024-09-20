import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardASOComponent } from './dashboard-aso.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'dashboard-aso', component: DashboardASOComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class DashboardsNemoRoutingModule {}
