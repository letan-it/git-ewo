import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePromoComponent } from './create-promo.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ImageModule } from 'primeng/image';
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
    declarations: [CreatePromoComponent],
    imports: [
        CommonModule,
        FormsModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        HttpClientModule,
        AngularEditorModule,
        ImageModule,
        ChipModule,
        CheckboxModule,
    ],
    exports: [CreatePromoComponent],
})
export class CreatePromoModule {}
