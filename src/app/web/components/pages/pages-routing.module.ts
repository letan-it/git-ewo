import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'crud',
                loadChildren: () =>
                    import('./crud/crud.module').then((m) => m.CrudModule),
            },
            {
                path: 'empty',
                loadChildren: () =>
                    import('./empty/emptydemo.module').then(
                        (m) => m.EmptyDemoModule
                    ),
            },
            {
                path: 'timeline',
                loadChildren: () =>
                    import('./timeline/timelinedemo.module').then(
                        (m) => m.TimelineDemoModule
                    ),
            },
            {
                path: 'workfollow',
                loadChildren: () =>
                    import('./work-follow/work-follow.module').then(
                        (m) => m.WorkFollowModule
                    ),
            },
            {
                path: 'demo',
                loadChildren: () =>
                    import('./demo/demo.module').then((m) => m.DemoModule),
            },

            {
                path: 'user-profile',
                loadChildren: () =>
                    import('./user-profile/user-profile.module').then(
                        (m) => m.UserProfileModule
                    ),
            },
            {
                path: 'add-user',
                loadChildren: () =>
                    import('./users/add-user/add-user.module').then(
                        (m) => m.AddUserModule
                    ),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./users/users.module').then((m) => m.UsersModule),
            },
            {
                path: 'stores',
                loadChildren: () =>
                    import('./stores/stores.module').then(
                        (m) => m.StoresModule
                    ),
            },
            {
                path: 'reports',
                loadChildren: () =>
                    import('./works/works.module').then((m) => m.WorksModule),
            },
            {
                path: 'timekeeping-report',
                loadChildren: () =>
                    import(
                        './works/timekeeping-report/timekeeping-report.module'
                    ).then((m) => m.TimekeepingReportModule),
            },
            {
                path: 'Compliance-Feedback',
                loadChildren: () =>
                    import(
                        './compliance-feedback/compliance-feedback.module'
                    ).then((m) => m.ComplianceFeedbackModule),
            },
            {
                path: 'projects',
                loadChildren: () =>
                    import('./projects/projects.module').then(
                        (m) => m.projectsModule
                    ),
            },

            {
                path: 'posm',
                loadChildren: () =>
                    import('./posm-shop/posm-shop.module').then(
                        (m) => m.PosmShopModule
                    ),
            },
            {
                path: 'inventory',
                loadChildren: () =>
                    import('./inventory/inventory.module').then(
                        (m) => m.InventoryModule
                    ),
            },
            {
                path: 'sos',
                loadChildren: () =>
                    import('./sos/sos.module').then((m) => m.SosModule),
            },
            {
                path: 'prcs',
                loadChildren: () =>
                    import('./prcs/prcs.module').then((m) => m.PrcsModule),
            },
            {
                path: 'promo',
                loadChildren: () =>
                    import('./promotion/promotion.module').then(
                        (m) => m.PromotionModule
                    ),
            },
            {
                path: 'topProduct',
                loadChildren: () =>
                    import('./sellOut/top-product/top-product.module').then(
                        (m) => m.TopProductModule
                    ),
            },
            {
                path: 'employee-action',
                loadChildren: () =>
                    import(
                        './sellOut/sell-out-employee/sell-out-employee.module'
                    ).then((m) => m.SellOutEmployeeModule),
            },
            {
                path: 'shop-action',
                loadChildren: () =>
                    import(
                        './sellOut/sell-out-target/sell-out-target.module'
                    ).then((m) => m.SellOutTargetModule),
            },
            {
                path: 'config',
                loadChildren: () =>
                    import(
                        './sellOut/sell-out-config/sell-out-config.module'
                    ).then((m) => m.SellOutConfigModule),
            },
            {
                path: 'osa',
                loadChildren: () =>
                    import('./OSA/osa/osa.module').then((m) => m.OsaModule),
            },
            {
                path: 'plans',
                loadChildren: () =>
                    import('./plans/plans.module').then((m) => m.plansModule),
            },
            {
                path: 'empShops',
                loadChildren: () =>
                    import('./empShop/empShop.module').then(
                        (m) => m.empShopModule
                    ),
            },
            {
                path: 'empFace',
                loadChildren: () =>
                    import('./empFace/empFace.module').then(
                        (m) => m.empFaceModule
                    ),
            },
            {
                path: 'field-coaching',
                loadChildren: () =>
                    import('./coaching/coaching.module').then(
                        (m) => m.FieldCoachingModule
                    ),
            },
            {
                path: 'survey',
                loadChildren: () =>
                    import('./survey/survey.module').then(
                        (m) => m.SurveyModule
                    ),
            },
            {
                path: 'attendances',
                loadChildren: () =>
                    import('./attendances/attendances.module').then(
                        (m) => m.attendancesModule
                    ),
            },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./settings/settings.module').then(
                        (m) => m.SettingsModule
                    ),
            },
            {
                path: 'works-survey',
                loadChildren: () =>
                    import('./works-survey/works-survey.module').then(
                        (m) => m.WorksSurveyModule
                    ),
            },
            {
                path: 'works-display',
                loadChildren: () =>
                    import('./works-promotion/works-promotion.module').then(
                        (m) => m.WorksPromotionModule
                    ),
            },
            {
                path: 'works-osa',
                loadChildren: () =>
                    import('./works-osa/works-osa.module').then(
                        (m) => m.WorksOsaModule
                    ),
            },
            {
                path: 'works-sos',
                loadChildren: () =>
                    import('./works-sos/works-sos.module').then(
                        (m) => m.WorksSosModule
                    ),
            },
            {
                path: 'works-posm',
                loadChildren: () =>
                    import('./works-posm/works-posm.module').then(
                        (m) => m.WorksPosmModule
                    ),
            },
            {
                path: 'works-activation',
                loadChildren: () =>
                    import('./works-activation/works-activation.module').then(
                        (m) => m.WorksActivationModule
                    ),
            },
            {
                path: 'works-inventory',
                loadChildren: () =>
                    import('./works-inventory/works-inventory.module').then(
                        (m) => m.WorksInventoryModule
                    ),
            },
            {
                path: 'works-attendance',
                loadChildren: () =>
                    import('./works-attendance/works-attendance.module').then(
                        (m) => m.WorksAttendanceModule
                    ),
            },
            {
                path: 'works-coaching',
                loadChildren: () =>
                    import('./works-coaching/works-coaching.module').then(
                        (m) => m.WorksCoachingModule
                    ),
            },
            {
                path: 'kpi-scheduler',
                loadChildren: () =>
                    import('./kpi-scheduler/kpi-scheduler.module').then(
                        (m) => m.KpiSchedulerModule
                    ),
            },
            {
                path: 'log-device',
                loadChildren: () =>
                    import('./device/log-device/log-device.module').then(
                        (m) => m.LogDeviceModule
                    ),
            },
            {
                path: 'log-file',
                loadChildren: () =>
                    import('./device/log-device/log-file/log-file.module').then(
                        (m) => m.LogFileModule
                    ),
            },
            {
                path: 'documents',
                loadChildren: () =>
                    import('./document/document.module').then(
                        (m) => m.DocumentModule
                    ),
            },
            {
                path: 'page-doc',
                loadChildren: () =>
                    import('./page-docs/page-docs.module').then(
                        (m) => m.PageDocsModule
                    ),
            },
            {
                path: 'works-ool',
                loadChildren: () =>
                    import('./works-ool/works-ool.module').then(
                        (m) => m.WorksOolModule
                    ),
            },
            {
                path: 'report-status',
                loadChildren: () =>
                    import('./report-status/report-status.module').then(
                        (m) => m.ReportStatusModule
                    ),
            },
            {
                path: 'master-status',
                loadChildren: () =>
                    import('./master-status/master-status.module').then(
                        (m) => m.MasterStatusModule
                    ),
            },
            {
                path: 'works-sellout',
                loadChildren: () =>
                    import('./works-sellout/works-sellout.module').then(
                        (m) => m.WorksSelloutModule
                    ),
            },
            {
                path: 'works-sellin',
                loadChildren: () =>
                    import('./works-sellin/works-sellin.module').then(
                        (m) => m.WorksSellinModule
                    ),
            },
            {
                path: 'product-order',
                loadChildren: () =>
                    import('./SellIn/product-order/product-order.module').then(
                        (m) => m.ProductOrderModule
                    ),
            },
            {
                path: 'sellin-employee',
                loadChildren: () =>
                    import(
                        './SellIn/sellin-employee/sellin-employee.module'
                    ).then((m) => m.SellinEmployeeModule),
            },
            {
                path: 'ool-shop',
                loadChildren: () =>
                    import('./ool/ool-shop/ool-shop.module').then(
                        (m) => m.OolShopModule
                    ),
            },
            {
                path: 'language',
                loadChildren: () =>
                    import('./language-setting/language-setting.module').then(
                        (m) => m.LanguageSettingModule
                    ),
            },
            {
                path: 'quick-test',
                loadChildren: () =>
                    import('./quick-test/quick-test.module').then(
                        (m) => m.QuickTestModule
                    ),
            },
            {
                path: 'activation/gifts',
                loadChildren: () =>
                    import('./activation/gifts/gifts.module').then(
                        (m) => m.GiftsModule
                    ),
            },
            {
                path: 'activation/config',
                loadChildren: () =>
                    import('./activation/config/config.module').then(
                        (m) => m.ConfigModule
                    ),
            },
            {
                path: 'activation/sms',
                loadChildren: () =>
                    import('./activation/sms/sms.module').then(
                        (m) => m.SmsModule
                    ),
            },
            {
                path: 'activation/log-api-gotit',
                loadChildren: () =>
                    import(
                        './activation/log-api-gotit/log-api-gotit.module'
                    ).then((m) => m.LogApiGotitModule),
            },
            {
                path: 'activation/promotion',
                loadChildren: () =>
                    import('./activation/promotion/promotion.module').then(
                        (m) => m.PromotionModule
                    ),
            },
            {
                path: 'activation/promotion-shop',
                loadChildren: () =>
                    import(
                        './activation/promotion/promotion-shop/promotion-shop.module'
                    ).then((m) => m.PromotionShopModule),
            },

            {
                path: 'activation/transactions',
                loadChildren: () =>
                    import(
                        './activation/transactions/transactions.module'
                    ).then((m) => m.TransactionsModule),
            },
            {
                path: 'activation/activation-form',
                loadChildren: () =>
                    import(
                        './activation/activation-form/activation-form.module'
                    ).then((m) => m.ActivationFormModule),
            },
            {
                path: 'activation/activation-form/form-shop',
                loadChildren: () =>
                    import(
                        './activation/activation-form/activation-form-shop/activation-form-shop.module'
                    ).then((m) => m.ActivationFormShopModule),
            },
            {
                path: 'transaction',
                loadChildren: () =>
                    import('./transaction/transaction.module').then(
                        (m) => m.TransactionModule
                    ),
            },

            // { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
