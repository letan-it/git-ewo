import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DocumentComponent } from './document.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: DocumentComponent }]),
    ],
    exports: [RouterModule],
})
export class DocumentRoutingModule {}
