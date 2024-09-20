import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FieldCoachingComponent } from './coaching.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FieldCoachingComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class FieldCoachingRoutingModule {}
