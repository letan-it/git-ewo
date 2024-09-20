import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogFileComponent } from './log-file.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LogFileComponent }
    ])],
    exports: [RouterModule]
})
export class LogFileRoutingModule {
    constructor() {

    }
}
