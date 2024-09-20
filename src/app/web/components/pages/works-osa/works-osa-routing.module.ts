import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksOsaComponent } from './works-osa.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorksOsaComponent }
    ])],
    exports: [RouterModule]
})
export class WorksOsaRoutingModule { }
