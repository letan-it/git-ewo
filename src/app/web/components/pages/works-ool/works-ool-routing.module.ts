import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksOolComponent } from './works-ool.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksOolComponent }
    ])],
    exports: [RouterModule]
})
export class WorksOolRoutingModule { }
