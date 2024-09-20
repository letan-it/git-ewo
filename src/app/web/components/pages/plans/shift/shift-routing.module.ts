import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShiftComponent } from './shift.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ShiftComponent }])],
    exports: [RouterModule],
})
export class shiftRoutingModule { }
