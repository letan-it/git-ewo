import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { MessagesModule } from 'primeng/messages';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MegaMenuModule } from 'primeng/megamenu';
import { TagModule } from 'primeng/tag';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SpeedDialModule } from 'primeng/speeddial';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ColorPickerModule } from 'primeng/colorpicker';
import { StyleClassModule } from 'primeng/styleclass';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { CarouselModule } from 'primeng/carousel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';

import { WorksDetailComponent } from './works-detail/works-detail.component';
import { QcResultComponent } from './qc-result/qc-result.component';
import { EditSurveyComponent } from './works-detail/edit-survey/edit-survey.component';
import { SurveyFormFixtureComponent } from './works-detail/edit-survey/survey-form-fixture/survey-form-fixture.component';
import { SurveyFormDefaultComponent } from './works-detail/edit-survey/survey-form-default/survey-form-default.component';
import { PosmDetailComponent } from './works-detail/posm/posm.component';
import { OsaDetailComponent } from './works-detail/osa/osa.component';
import { ShopInfoComponent } from './works-detail/shop-info/shop-info.component';
import { PromotionComponent } from './works-detail/promotion/promotion.component';
import { SellOutComponent } from './works-detail/sell-out/sell-out.component';
import { OolComponent } from './works-detail/ool/ool.component';
import { SellInComponent } from './works-detail/sell-in/sell-in.component';
import { ActivationComponent } from './works-detail/activation/activation.component';
import { WorksRoutingModule } from './works-routing.module';
import { WorksComponent } from './works.component';
import { SharedModule } from '../shared.module';
import { WorksInventoryComponent } from './works-detail/works-inventory/works-inventory.component';
import { SosComponent } from './works-detail/sos/sos.component';
import { TimekeepingReportComponent } from './timekeeping-report/timekeeping-report.component';
import { WorkTrainComponent } from './work-train/work-train.component';
import { WorkRecruitmentComponent } from './work-recruitment/work-recruitment.component';
// import { FieldCoachingComponent } from './works-detail/field-coaching/field-coaching.component';

@NgModule({
    imports: [
        CommonModule, BadgeModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        WorksRoutingModule,
        SharedModule,
        TableModule,
        InputSwitchModule,
        DropdownModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        CheckboxModule,
        FormsModule,
        PaginatorModule,
        DialogModule,
        ImageModule,
        TabViewModule,
        CalendarModule,
        MessagesModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        MegaMenuModule,
        RouterModule,
        TagModule,
        InputTextareaModule,
        GalleriaModule,
        ToastModule,
        FieldsetModule,
        PanelModule,
        ScrollPanelModule,
        SpeedDialModule,
        OverlayPanelModule,
        ListboxModule,
        AccordionModule,
        SkeletonModule,
        AvatarModule,
        MultiSelectModule,
        ColorPickerModule,
        StyleClassModule,
        ProgressSpinnerModule,
        ProgressBarModule,
        CarouselModule,
        KeyFilterModule,
        ReactiveFormsModule,
        SelectButtonModule,
        MenuModule
    ],
    declarations: [
        WorksComponent,
        WorksDetailComponent,
        QcResultComponent,
        EditSurveyComponent,
        SurveyFormFixtureComponent,
        SurveyFormDefaultComponent,
        PosmDetailComponent,
        OsaDetailComponent,
        ShopInfoComponent,
        PromotionComponent,
        OolComponent,
        SellOutComponent,
        SellInComponent,
        ActivationComponent,
        WorksInventoryComponent,
        SosComponent,
        TimekeepingReportComponent,
        WorkTrainComponent,
        WorkRecruitmentComponent
        // FieldCoachingComponent
    ]
})
export class WorksModule { }
