import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'error',
                loadChildren: () =>
                    import('./error/error.module').then((m) => m.ErrorModule),
            },
            {
                path: 'access',
                loadChildren: () =>
                    import('./access/access.module').then(
                        (m) => m.AccessModule
                    ),
            },
           
            {
                path: 'login',
                loadChildren: () =>
                    import('./login/login.module').then((m) => m.LoginModule),
            },
            {
                path: 'change-password',
                loadChildren: () =>
                    import('./change-password/change-password.module').then(
                        (m) => m.ChangePassWordModule
                    ),
            },
            // { path: '**', redirectTo: '/notfound' },
            {
                //path: 'plans-share/:login_name/:password',
                path: 'plans',
                loadChildren: () =>
                    import('../pages/plans/plans.module').then(
                        (m) => m.plansModule
                    ),
            },
             
            {
                path: 'survey',
                loadChildren: () =>
                    import('../pages/survey/survey.module').then(
                        (m) => m.SurveyModule
                    ),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('../pages/users/users.module').then(
                        (m) => m.UsersModule
                    ),
            },
            {
                path: 'stores',
                loadChildren: () =>
                    import('../pages/stores/stores.module').then(
                        (m) => m.StoresModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
