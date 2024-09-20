import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageSettingComponent } from './language-setting.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LanguageSettingComponent },
        {
            path: 'settings',
            loadChildren: () =>
                import('./language-setting.module').then(
                    (m) => m.LanguageSettingModule
                ),
        },
    ])],
    exports: [RouterModule],

    
})
export class LanguageSettingRoutingModule { }
