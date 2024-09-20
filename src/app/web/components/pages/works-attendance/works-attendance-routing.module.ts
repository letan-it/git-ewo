import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksAttendanceComponent } from './works-attendance.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksAttendanceComponent }
    ])],
    exports: [RouterModule]
})
export class WorksAttendanceRoutingModule { }
