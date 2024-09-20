import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReasonComponent } from './reason.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ReasonComponent }
    ])],
    exports: [RouterModule]
})
export class ReasonRoutingModule { }
