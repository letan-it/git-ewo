import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';  
import { OsaComponent } from './osa.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: OsaComponent },

        // {
        //     path: 'posm-list',
        //     loadChildren: () =>
        //         import('../posm/posm.module').then((m) => m.PosmModule),
        // },
        {
            path: 'reason',
            loadChildren: () =>
                import('../Reason/reason/reason.module').then((m) => m.ReasonModule),
        },
        {
            path: 'product',
            loadChildren: () =>
                import('../product/product.module').then((m) => m.ProductModule),
        },

    ])],
    exports: [RouterModule]
})
export class OsaRoutingModule { }
