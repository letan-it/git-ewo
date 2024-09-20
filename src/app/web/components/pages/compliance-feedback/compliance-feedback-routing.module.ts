import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComplianceFeedbackComponent } from './compliance-feedback.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ComplianceFeedbackComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ComplianceFeedbackRoutingModule {}
