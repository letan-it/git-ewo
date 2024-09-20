import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { attendancesComponent } from './attendances.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: attendancesComponent }]),
    ],
    exports: [RouterModule],
})
export class attendancesRoutingModule {}
