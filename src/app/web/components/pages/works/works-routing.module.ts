import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksComponent } from './works.component';
import { WorkTrainComponent } from './work-train/work-train.component';
import { WorkRecruitmentComponent } from './work-recruitment/work-recruitment.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksComponent },
        { path: 'work-train', component: WorkTrainComponent },
        { path: 'work-recruitment', component: WorkRecruitmentComponent }
    ])],
    exports: [RouterModule],
})
export class WorksRoutingModule {}
