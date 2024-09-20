import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoresComponent } from './stores.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: StoresComponent },
            {
                path: 'router',
                loadChildren: () =>
                    import('./store-router/store-router.module').then((m) => m.RouterModule),
            },
            {
                path: 'type',
                loadChildren: () =>
                    import('./store-type/store-type.module').then((m) => m.TypeModule),
            },
            {
                path: 'channel',
                loadChildren: () =>
                    import('./store-channel/store-channel.module').then((m) => m.ChannelModule),
            },

            {
                path: 'target',
                loadChildren: () =>
                    import('./store-target/store-target.module').then((m) => m.TargetModule),
            },
            {
                path: 'supplier',
                loadChildren: () =>
                    import('./store-supplier/store-supplier.module').then((m) => m.SupplierModule),
            },

        ]),
    ],
    exports: [RouterModule],
})
export class StoresRoutingModule { }
