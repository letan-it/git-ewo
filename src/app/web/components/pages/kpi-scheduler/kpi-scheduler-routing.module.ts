import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KpiSchedulerComponent } from './kpi-scheduler.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: KpiSchedulerComponent }
    ])],
    exports: [RouterModule]
})
export class KpiSchedulerRoutingModule {
    constructor() {

    }
}
