import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksCoachingComponent } from './works-coaching.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksCoachingComponent }
    ])],
    exports: [RouterModule]
})
export class WorksCoachingRoutingModule { }
