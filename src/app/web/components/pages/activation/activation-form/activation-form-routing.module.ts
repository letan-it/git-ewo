import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivationFormComponent } from './activation-form.component';
import { ActivationFormShopComponent } from './activation-form-shop/activation-form-shop.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ActivationFormComponent },
        { path: 'form-shop', component: ActivationFormShopComponent },
        {
            path: '',
            loadChildren: () =>
                import('./activation-form.module').then(
                    (m) => m.ActivationFormModule
                ),
        },

    ])],
    exports: [RouterModule]
})
export class ActivationFormRoutingModule { }
