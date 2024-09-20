import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivationFormShopComponent } from './activation-form-shop.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ActivationFormShopComponent }
    ])],
    exports: [RouterModule]
})
export class ActivationFormShopRoutingModule { }
