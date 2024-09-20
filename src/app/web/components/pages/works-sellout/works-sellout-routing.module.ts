import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksSelloutComponent } from './works-sellout.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksSelloutComponent }
    ])],
    exports: [RouterModule]
})
export class WorksSelloutRoutingModule { }
