import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellOutTargetComponent } from './sell-out-target.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SellOutTargetComponent }
    ])],
    exports: [RouterModule]
})
export class SellOutTargetRoutingModule { }
