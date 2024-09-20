import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { SurveyDetailsComponent } from './survey-details.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: SurveyDetailsComponent }])],
    exports: [RouterModule],
})
export class SurveyDetailsRoutingModule {}
