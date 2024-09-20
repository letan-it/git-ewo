import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GotitConfigComponent } from './gotit-config.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GotitConfigComponent }
    ])],
    exports: [RouterModule]
})
export class GotitConfigRoutingModule { }
