import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OolListComponent } from './ool-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: OolListComponent }
    ])],
    exports: [RouterModule]
})
export class OolListRoutingModule { }
