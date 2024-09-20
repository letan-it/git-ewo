import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellOutConfigComponent } from './sell-out-config.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SellOutConfigComponent }
    ])],
    exports: [RouterModule]
})
export class SellOutConfigRoutingModule { }
