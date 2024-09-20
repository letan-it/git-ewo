import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopProductComponent } from './top-product.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TopProductComponent }
    ])],
    exports: [RouterModule]
})
export class TopProductRoutingModule { }
