import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksPosmComponent } from './works-posm.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: WorksPosmComponent }]),
    ],
    exports: [RouterModule],
})
export class WorksPosmRoutingModule {}
