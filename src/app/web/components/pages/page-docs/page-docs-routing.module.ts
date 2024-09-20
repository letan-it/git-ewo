import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { PageDocsComponent } from './page-docs.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: PageDocsComponent }]),
    ],
    exports: [RouterModule],
})
export class PageDocsRoutingModule {}
