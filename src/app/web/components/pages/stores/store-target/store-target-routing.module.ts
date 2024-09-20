import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { StoreTargetComponent } from './store-target.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StoreTargetComponent }, 
    ])],
    
    exports: [RouterModule]
})
export class TargetRoutingModule { }
