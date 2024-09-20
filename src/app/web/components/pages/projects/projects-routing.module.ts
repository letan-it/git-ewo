import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { projectsComponent } from './projects.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: projectsComponent }]),
    ],
    exports: [RouterModule],
})
export class projectsRoutingModule {}
