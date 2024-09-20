import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { empShopComponent } from './empShop.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: empShopComponent }]),
    ],
    exports: [RouterModule],
})
export class empShopRoutingModule {}
