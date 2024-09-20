import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { PosmShopComponent } from './posm-shop.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PosmShopComponent },

        {
            path: 'posm-list',
            loadChildren: () =>
                import('../posm/posm.module').then((m) => m.PosmModule),
        },
        {
            path: 'reason',
            loadChildren: () =>
                import('../posm/reason/reason.module').then((m) => m.ReasonModule),
        },

    ])],
    exports: [RouterModule]
})
export class PosmShopRoutingModule { }
