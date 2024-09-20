import { NgModule } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FileUploadModule } from 'primeng/fileupload';
import { SkeletonModule } from 'primeng/skeleton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ImageModule } from 'primeng/image';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AccordionModule } from 'primeng/accordion';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

import { ControlEmployeeComponent } from '../control/control-employee-type/control-employee-type.component';
import { ControlEmployeeListComponent } from '../control/control-employee-list/control-employee-list.component';
import { ControlShopTypeComponent } from '../control/control-shop-type/control-shop-type.component';
import { ControlShopRouterComponent } from '../control/control-shop-router/control-shop-router.component';
import { ControlChannelComponent } from '../control/control-channel/control-channel.component';
import { ControlProvinceComponent } from '../control/control-province/control-province.component';
import { ControlDistrictComponent } from '../control/control-district/control-district.component';
import { ControlWardComponent } from '../control/control-ward/control-ward.component';
import { ControlShiftsComponent } from '../control/control-shifts/control-shifts.component';
import { ControlReportStatusComponent } from '../control/control-report-status/control-report-status.component';
import { ControlSurveyListComponent } from '../control/control-survey-list/control-survey-list.component';
import { ControlQuestionMasterComponent } from '../control/control-question-master/control-question-master.component';
import { ControlSurveyTypeComponent } from '../control/control-survey-type/control-survey-type.component';
import { ControlTabPhotoComponent } from '../control/control-tab-photo/control-tab-photo.component';
import { ControlProjectComponent } from '../control/control-project/control-project.component';
import { ControlEmployeeProjectComponent } from '../control/control-employee-project/control-employee-project.component';
import { ControlPosmListComponent } from '../control/control-posm-list/control-posm-list.component';
import { ControlOsaCategoryComponent } from '../control/control-osa-category/control-osa-category.component';
import { ControlAreasComponent } from '../control/control-areas/control-areas.component';
import { ControlRegionComponent } from '../control/control-region/control-region.component';
import { ControlPositionComponent } from '../control/control-position/control-position.component';
import { ControlShopAreasComponent } from '../control/control-shop-areas/control-shop-areas.component';
import { ControlEmployeeCategoryComponent } from '../control/control-employee-category/control-employee-category.component';
import { ControlPosmReasonComponent } from '../control/control-posm-reason/control-posm-reason.component';
import { ControlShopSuppliersComponent } from '../control/control-shop-suppliers/control-shop-suppliers.component';
import { BreadcrumbMenuComponent } from '../control/breadcrumb-menu/breadcrumb-menu.component';
import { ControlOsaProductComponent } from '../control/control-osa-product/control-osa-product.component';
import { ControlOsaReasonComponent } from '../control/control-osa-reason/control-osa-reason.component';
import { ControlYearMonthComponent } from '../control/control-year-month/control-year-month.component';
import { ControlPromotionComponent } from '../control/control-promotion/control-promotion.component';
import { ControlShopListComponent } from '../control/control-shop-list/control-shop-list.component';
import { ControlStatusCheckComponent } from '../control/control-status-check/control-status-check.component';
import { ControlOolListComponent } from '../control/control-ool-list/control-ool-list.component';
import { ControlGiftComponent } from '../control/control-gift/control-gift.component';
import { ControlActivationPromotionComponent } from '../control/control-activation-promotion/control-activation-promotion.component';
import { ControlActivationFormComponent } from '../control/control-activation-form/control-activation-form.component';
import { ControlAttendanceComponent } from '../control/control-attendance/control-attendance.component';
import { ControlBrandComponent } from '../control/control-brand/control-brand.component';
import { ControlProcessListComponent } from '../control/control-process-list/control-process-list.component';
import { ControlSurveyModelEditComponent } from '../control/control-survey-model-edit/control-survey-model-edit.component';

import { FieldCoachingComponent } from './works/works-detail/field-coaching/field-coaching.component';

@NgModule({
    imports: [
        DropdownModule, OverlayPanelModule, TagModule, SplitterModule,
        DividerModule, AvatarModule, AvatarGroupModule,
        StepsModule, BadgeModule, RippleModule,
        FormsModule,
        CommonModule,
        ListboxModule,
        InputTextModule,
        GalleriaModule,
        ButtonModule,
        TabViewModule,
        TableModule,
        CheckboxModule,
        MultiSelectModule,
        ToastModule,
        ConfirmPopupModule,
        FileUploadModule,
        SkeletonModule,
        BreadcrumbModule,
        ImageModule,
        ScrollPanelModule,
        AccordionModule,
        DialogModule
    ],

    declarations: [
        BreadcrumbMenuComponent,

        ControlEmployeeComponent,
        ControlEmployeeListComponent,
        ControlShopTypeComponent,
        ControlShopRouterComponent,
        ControlChannelComponent,
        ControlProvinceComponent,
        ControlDistrictComponent,
        ControlWardComponent,
        ControlShiftsComponent,
        ControlReportStatusComponent,
        ControlSurveyListComponent,
        ControlQuestionMasterComponent,
        ControlSurveyTypeComponent,
        ControlSurveyModelEditComponent,
        ControlTabPhotoComponent,
        ControlProjectComponent,
        ControlEmployeeProjectComponent,
        ControlPosmListComponent,
        ControlOsaCategoryComponent,
        ControlAreasComponent,
        ControlRegionComponent,
        ControlPositionComponent,
        ControlShopAreasComponent,
        ControlEmployeeCategoryComponent,
        ControlPosmReasonComponent,
        ControlShopSuppliersComponent,
        ControlOsaProductComponent,
        ControlOsaReasonComponent,
        ControlYearMonthComponent,
        ControlPromotionComponent,
        ControlShopListComponent,
        ControlOolListComponent,
        ControlGiftComponent,
        ControlActivationPromotionComponent,
        ControlActivationFormComponent, 
        ControlAttendanceComponent,
        ControlBrandComponent,
        ControlProcessListComponent,
        ControlStatusCheckComponent,

        FieldCoachingComponent
    ],
    exports: [
        BreadcrumbMenuComponent,

        ControlEmployeeComponent,
        ControlEmployeeListComponent,
        ControlShopTypeComponent,
        ControlShopRouterComponent,
        ControlChannelComponent,
        ControlProvinceComponent,
        ControlDistrictComponent,
        ControlWardComponent,
        ControlShiftsComponent,
        ControlReportStatusComponent,
        ControlSurveyListComponent,
        ControlQuestionMasterComponent,
        ControlSurveyTypeComponent,
        ControlSurveyModelEditComponent,
        ControlTabPhotoComponent,
        ControlProjectComponent,
        ControlEmployeeProjectComponent,
        ControlPosmListComponent,
        ControlOsaCategoryComponent,
        ControlAreasComponent,
        ControlRegionComponent,
        ControlPositionComponent,
        ControlShopAreasComponent,
        ControlEmployeeCategoryComponent,
        ControlPosmReasonComponent,
        ControlShopSuppliersComponent,
        ControlOsaProductComponent,
        ControlOsaReasonComponent,
        ControlYearMonthComponent,
        ControlPromotionComponent,
        ControlShopListComponent,
        ControlOolListComponent,
        ControlGiftComponent,
        ControlActivationPromotionComponent,
        ControlActivationFormComponent, ControlAttendanceComponent,
        ControlBrandComponent,
        ControlStatusCheckComponent,

        FieldCoachingComponent
    ],
})
export class SharedModule { }
