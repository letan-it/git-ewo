import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksSellinComponent } from './works-sellin.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksSellinComponent }
    ])],
    exports: [RouterModule]
})
export class WorksSellinRoutingModule { }
