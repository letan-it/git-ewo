import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SurveyComponent } from './survey.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: SurveyComponent },
            {
                path: 'details',
                loadChildren: () =>
                    import('./survey-details/survey-details.module').then(
                        (m) => m.SurveyDetailsModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class SurveyRoutingModule {}
