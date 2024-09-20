import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigComponent } from './config.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ConfigComponent }
    ])],
    exports: [RouterModule]
})
export class ConfigRoutingModule { }
