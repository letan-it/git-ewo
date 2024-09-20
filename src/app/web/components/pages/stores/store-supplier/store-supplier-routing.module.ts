import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreSupplierComponent } from './store-supplier.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StoreSupplierComponent }

    ])],
    exports: [RouterModule]
})
export class SupplierRoutingModule { }
