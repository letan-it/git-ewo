import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { AccessRoutingModule } from './access-routing.module';
import { AccessComponent } from './access.component';
import { PublishImageComponent } from '../publish-image/publish-image.component';
import { GalleriaModule } from 'primeng/galleria';
import { DataViewModule } from 'primeng/dataview';
import { ImageModule } from 'primeng/image';

import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ViewComponent } from 'src/app/app-powerbi/view/view.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { AceEditorModule } from 'ng2-ace-editor';
import { ScrollPanelModule } from 'primeng/scrollpanel';
@NgModule({
    imports: [
        CommonModule,
        AccessRoutingModule,
        ButtonModule,
        GalleriaModule,
        DataViewModule,
        ImageModule,
        NgxJsonViewerModule,
        FormsModule,
        InputTextModule,
        ToolbarModule,
        AceEditorModule,
        ScrollPanelModule
      
    ],
    declarations: [AccessComponent,PublishImageComponent,ViewComponent]
})
export class AccessModule { }
