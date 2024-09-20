


import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { DashboardPosmComponent } from './dashboard-posm.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardPosmComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardPosmRoutingModule { }
