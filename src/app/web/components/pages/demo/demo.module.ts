import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ListboxModule } from 'primeng/listbox';
import { DemoComponent } from './demo.component';
import { SmartBoothComponent } from './smart-booth/smart-booth.component';
import { DemoRoutingModule } from './demo.routing.module';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
import { ApiConfigComponent } from './api-config/api-config.component';
@NgModule({
    imports: [
        CommonModule,
        TimelineModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        CardModule,
        DemoRoutingModule,
        CheckboxModule,
        AvatarModule,
        MenuModule,
        AvatarGroupModule,
        TagModule,
        ChipModule,
        DropdownModule,
        ToastModule,
        MultiSelectModule,
        OverlayPanelModule,
        DialogModule,
        EditorModule,
        AngularEditorModule,
        ListboxModule,
        TableModule,
        ImageModule,
 
        
    ],
    declarations: [
        DemoComponent,
        SmartBoothComponent,
        ApiConfigComponent
    ]
})
export class DemoModule { }
