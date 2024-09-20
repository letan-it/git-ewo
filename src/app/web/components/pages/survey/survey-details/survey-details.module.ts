import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { SurveyDetailsRoutingModule } from './survey-details-routing.module';
import { SurveyDetailsComponent } from './survey-details.component';
import { AddSurveyComponent } from './add-survey/add-survey.component';
import { SharedModule } from '../../shared.module';
import { QuestionComponent } from './question/question.component';
import { AnswersComponent } from './question/answers/answers.component';
import { AnswersDetailsComponent } from './question/answers/answers-details/answers-details.component';
import { QuestionDetailsComponent } from './question/question-details/question-details.component';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MultiSelectModule } from 'primeng/multiselect';
import { AceEditorModule } from 'ng2-ace-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        SurveyDetailsComponent,
        QuestionComponent,
        AnswersComponent,
        AddSurveyComponent,
        AnswersDetailsComponent,
        QuestionDetailsComponent,
    ],
    imports: [
        CommonModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        SurveyDetailsRoutingModule,
        CommonModule,
        TimelineModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TableModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        CheckboxModule,
        DropdownModule,
        PaginatorModule,
        DialogModule,
        MessagesModule,
        InputMaskModule,
        ListboxModule,
        CalendarModule,
        SharedModule,
        TagModule,
        RadioButtonModule,
        InputTextareaModule,
        NgxJsonViewerModule,
        ConfirmPopupModule,
        MultiSelectModule,
        AceEditorModule,
        AngularEditorModule
    ]
})
export class SurveyDetailsModule {}
