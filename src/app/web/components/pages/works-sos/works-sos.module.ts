import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
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
import { RouterModule } from '@angular/router';
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
import { WorksSosRoutingModule } from './works-sos-routing.module';
import { WorksSosComponent } from './works-sos.component';
import { WorksSosDetailsComponent } from './works-sos-details/works-sos-details.component';
import { SosDetailsComponent } from './works-sos-details/sos-details/sos-details.component';
import { QcResultSosComponent } from './qc-result-sos/qc-result-sos.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        WorksSosRoutingModule,
        TableModule,
        RadioButtonModule,
        SharedModule,
        DropdownModule,
        TimelineModule,
        ButtonModule,
        CardModule,
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
        SelectButtonModule,
        MenuModule,
    ],
    declarations: [
        WorksSosComponent,
        WorksSosDetailsComponent,
        SosDetailsComponent,
        QcResultSosComponent,
    ],
})
export class WorksSosModule {}
