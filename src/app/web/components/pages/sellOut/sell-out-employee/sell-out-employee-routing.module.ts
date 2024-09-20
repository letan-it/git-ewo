import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellOutEmployeeComponent } from './sell-out-employee.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SellOutEmployeeComponent }
    ])],
    exports: [RouterModule]
})
export class SellOutEmployeeRoutingModule { }
