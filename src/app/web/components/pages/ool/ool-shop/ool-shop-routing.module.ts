import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OolShopComponent } from './ool-shop.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: OolShopComponent },
        {
            path: 'ool-list',
            loadChildren: () =>
                import('./ool-list/ool-list.module').then(
                    (m) => m.OolListModule
                ),
        },
    ])],
    exports: [RouterModule]
})
export class OolShopRoutingModule { }
