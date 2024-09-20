import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksActivationComponent } from './works-activation.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: WorksActivationComponent }]),
    ],
    exports: [RouterModule],
})
export class WorksActivationRoutingModule {}
