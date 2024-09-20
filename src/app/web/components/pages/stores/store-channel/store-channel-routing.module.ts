import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';  
import { StoreChannelComponent } from './store-channel.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StoreChannelComponent }

    ])],
    exports: [RouterModule]
})
export class ChannelRoutingModule { }
