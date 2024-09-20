import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { empFaceComponent } from './empFace.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: empFaceComponent }]),
    ],
    exports: [RouterModule],
})
export class empFaceRoutingModule {}
