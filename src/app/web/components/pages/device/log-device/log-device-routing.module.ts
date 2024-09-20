import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogDeviceComponent } from './log-device.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LogDeviceComponent }
    ])],
    exports: [RouterModule]
})
export class LogDeviceRoutingModule {
    constructor() {

    }
}
