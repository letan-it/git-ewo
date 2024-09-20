import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';   
import { PrcsConfigComponent } from './prcs-config.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PrcsConfigComponent }
    ])],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
