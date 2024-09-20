import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GiftsComponent } from './gifts.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GiftsComponent }
    ])],
    exports: [RouterModule]
})
export class GiftsRoutingModule { }
