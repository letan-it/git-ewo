import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './web/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './Core/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
                //{ path: '', redirectTo: '/works', pathMatch: 'full' },
                //{ path: '', redirectTo: '/users', pathMatch: 'full' },
                //{ path: '', redirectTo: '/stores', pathMatch: 'full' },
                // { path: '', redirectTo: '/survey', pathMatch: 'full' },
                //{ path: '', redirectTo: '/plans', pathMatch: 'full' },

                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        //// SELLOUT
                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/sellOut/sell-out-employee/sell-out-employee.module'
                        //         ).then((m) => m.SellOutEmployeeModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/sell-out-employee:1.0.0 "."
                        //     // docker push reg.acacy.vn:5443/acacy/sell-out-employee:1.0.0
                        // },

                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/sellOut/sell-out-target/sell-out-target.module'
                        //         ).then((m) => m.SellOutTargetModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/sell-out-target:1.0.0 "."
                        //     //docker push reg.acacy.vn:5443/acacy/sell-out-target:1.0.0
                        // },
                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/sellOut/top-product/top-product.module'
                        //         ).then((m) => m.TopProductModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/sell-out-top-product:1.0.0 "."
                        //     // docker push reg.acacy.vn:5443/acacy/sell-out-top-product:1.0.0
                        // },

                        //// DISPLAY
                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/promotion/promotion.module'
                        //         ).then((m) => m.PromotionModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/display-shop:1.0.0 "."
                        //     // docker push reg.acacy.vn:5443/acacy/display-shop:1.0.0
                        // },
                        //  {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/promotion/promo/promo.module'
                        //         ).then((m) => m.PromoModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/display-promotion:1.0.0 "."
                        //     // docker push reg.acacy.vn:5443/acacy/display-promotion:1.0.0
                        // },

                        //// SURVEY
                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/survey/survey.module'
                        //         ).then((m) => m.SurveyModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/survey-shop:1.0.0 "."
                        //     // docker push reg.acacy.vn:5443/acacy/survey-shop:1.0.0
                        // },
                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/survey/survey-details/survey-details.module'
                        //         ).then((m) => m.SurveyDetailsModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/survey-form:1.0.0 "."
                        //     // docker push reg.acacy.vn:5443/acacy/survey-form:1.0.0
                        // },

                        //// OSA
                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/pages/OSA/osa/osa.module'
                        //         ).then((m) => m.OsaModule),
                        //     // docker build --pull --rm -f "Dockerfile_proxy" -t reg.acacy.vn:5443/acacy/osa-stockout:1.0.0 "."
                        //     // docker push reg.acacy.vn:5443/acacy/osa-stockout:1.0.0
                        // },

                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './web/components/pages/pages.module'
                                ).then((m) => m.PagesModule),
                        },
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './web/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        // {
                        //     path: '',
                        //     loadChildren: () =>
                        //         import(
                        //             './web/components/dashboard-aso/dashboard-aso.module'
                        //         ).then((m) => m.DashboardASOModule),
                        // },

                        {
                            path: 'uikit',
                            loadChildren: () =>
                                import(
                                    './web/components/uikit/uikit.module'
                                ).then((m) => m.UIkitModule),
                        },
                        {
                            path: 'utilities',
                            loadChildren: () =>
                                import(
                                    './web/components/utilities/utilities.module'
                                ).then((m) => m.UtilitiesModule),
                        },
                        {
                            path: 'documentation',
                            loadChildren: () =>
                                import(
                                    './web/components/documentation/documentation.module'
                                ).then((m) => m.DocumentationModule),
                        },
                        {
                            path: 'blocks',
                            loadChildren: () =>
                                import(
                                    './web/components/primeblocks/primeblocks.module'
                                ).then((m) => m.PrimeBlocksModule),
                        },

                        {
                            path: 'dashboard-sellout',
                            loadChildren: () =>
                                import('./web/components/dashboard-sellout/dashboard-sellout.module').then(
                                    (m) => m.DashboardSelloutModule
                                )
                        },
                        {
                            path: 'dashboard-atd',
                            loadChildren: () =>
                                import('./web/components/dashboard-atd/dashboard-atd.module').then(
                                    (m) => m.DashboardAtdModule
                                )
                        },

                        {
                            path: 'dashboard-monitor',
                            loadChildren: () =>
                                import('./web/components/dashboard-monitor/dashboard-monitor.module').then(
                                    (m) => m.DashboardMonitorModule
                                )
                        },
                        {
                            path: 'dashboard-posm',
                            loadChildren: () =>
                                import('./web/components/dashboard-posm/dashboard-posm.module').then(
                                    (m) => m.DashboardPosmModule
                                )
                        },
                    ],
                    canActivate: [AuthGuard],
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./web/components/auth/auth.module').then(
                            (m) => m.AuthModule
                        ),
                },
                {
                    path: 'activation',
                    loadChildren: () =>
                        import(
                            './Mobile/sellout-report/sellout-report.module'
                        ).then((m) => m.SellOutReportModule),
                },
                {
                    path: 'summary-workshift',
                    loadChildren: () =>
                        import(
                            './Mobile/project_21/summary-workshift/summary-workshift.module'
                        ).then((m) => m.SummaryWorkshiftModule),
                },
                {
                    path: 'supervision',
                    loadChildren: () =>
                        import(
                            './Mobile/ReportATD/supervision/supervision.module'
                        ).then((m) => m.SupervisionModule),
                },
                {
                    path: 'dashboard-report',
                    loadChildren: () =>
                        import(
                            './Mobile/dashboard-report/dashboard-report.module'
                        ).then((m) => m.DashboardReportModule),
                },
                {
                    path: 'landing',
                    loadChildren: () =>
                        import('./web/components/landing/landing.module').then(
                            (m) => m.LandingModule
                        ),
                    canActivate: [AuthGuard],
                },


                { path: 'notfound', component: NotfoundComponent },
                // { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
                useHash: true,
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
