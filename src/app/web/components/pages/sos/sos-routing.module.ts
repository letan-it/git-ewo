import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SosComponent } from './sos.component';
import { SosListComponent } from './sos-list/sos-list.component';
import { SosConfigComponent } from './sos-config/sos-config.component';
import { SosShopComponent } from './sos-shop/sos-shop.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SosComponent },
        { path: 'list', component: SosListComponent },
        { path: 'config', component: SosConfigComponent },
        { path: 'shop', component: SosShopComponent },
    ])],
    exports: [RouterModule]
})
export class SosRoutingModule {
    constructor() { }
}
