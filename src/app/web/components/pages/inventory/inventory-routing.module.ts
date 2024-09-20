import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { InventoryConfigComponent } from './inventory-config/inventory-config.component';
import { InventoryReasonComponent } from './inventory-reason/inventory-reason.component';
import { InventoryShopComponent } from './inventory-shop/inventory-shop.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InventoryComponent },
        { path: 'config', component: InventoryConfigComponent },
        { path: 'reason', component: InventoryReasonComponent },
        { path: 'shop', component: InventoryShopComponent },
    ])],
    exports: [RouterModule]
})
export class InventoryRoutingModule {
    constructor() { }
}
