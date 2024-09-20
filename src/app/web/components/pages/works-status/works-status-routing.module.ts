import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksStatusComponent } from './works-status.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksStatusComponent }
    ])],
    exports: [RouterModule]
})
export class WorksStatusRoutingModule {
    constructor() {

    }
}
