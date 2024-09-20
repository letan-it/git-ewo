import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterStatusComponent } from './master-status.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MasterStatusComponent }
    ])],
    exports: [RouterModule]
})
export class MasterStatusRoutingModule {
    constructor() {

    }
}
