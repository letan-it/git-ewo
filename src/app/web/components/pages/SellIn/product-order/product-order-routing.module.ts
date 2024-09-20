import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductOrderComponent } from './product-order.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ProductOrderComponent }
    ])],
    exports: [RouterModule]
})
export class ProductOrderRoutingModule { }
