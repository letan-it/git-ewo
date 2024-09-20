import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksSosComponent } from './works-sos.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: WorksSosComponent }]),
    ],
    exports: [RouterModule],
})
export class WorksSosRoutingModule {}
