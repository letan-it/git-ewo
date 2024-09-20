import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';   
import { GroupProductComponent } from './group-product.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GroupProductComponent }
    ])],
    exports: [RouterModule]
})
export class GroupProductRoutingModule { }
