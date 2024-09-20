import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellinEmployeeComponent } from './sellin-employee.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SellinEmployeeComponent }
    ])],
    exports: [RouterModule]
})
export class SellinEmployeeRoutingModule { }
