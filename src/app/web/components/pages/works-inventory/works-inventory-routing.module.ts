import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorksInventoryComponent } from './works-inventory.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: WorksInventoryComponent }]),
    ],
    exports: [RouterModule],
})
export class WorksInventoryRoutingModule {}
