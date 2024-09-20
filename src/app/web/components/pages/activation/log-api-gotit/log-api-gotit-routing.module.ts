import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogApiGotitComponent } from './log-api-gotit.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LogApiGotitComponent }
    ])],
    exports: [RouterModule]
})
export class LogApiGotitRoutingModule { }
