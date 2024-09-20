import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksSurveyComponent } from './works-survey.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksSurveyComponent }
    ])],
    exports: [RouterModule]
})
export class WorksSurveyRoutingModule { }
