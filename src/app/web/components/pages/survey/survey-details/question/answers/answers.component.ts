import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { log } from 'console';
import {
    ConfirmationService,
    Message,
    MessageService,
    SelectItem,
} from 'primeng/api';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { AppComponent } from 'src/app/app.component';
import { Answers } from 'src/app/web/models/answers';
import { SurveyService } from 'src/app/web/service/survey.service';

interface City {
    name: string;
    code: string;
}

@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss'],
})
export class AnswersComponent {
    @Input() inValue: any;
    @Input() survey_item: any = undefined;
    @Input() question_id: any;
    @Input() action: any = 'view';
    @Input() question: any;

    msgs: Message[] = [];
    msgsInfo: Message[] = [];
    checked: boolean = false;
    message: string = '';
    display: boolean = false;

    AnswersCreate: boolean = false;
    clearMess: boolean = true;

    answers!: Answers[];
    clonedAnswers: { [s: number]: Answers } = {};

    constructor(
        private messageService: MessageService,
        private surveyService: SurveyService
    ) { }

    selectedCity: any;
    
    ngOnInit() {
        this.item_NextQuestion = this.inValue;
        console.log('inValue',this.inValue);
        console.log('survey_item',this.survey_item);
        
    }
    item_NextQuestion: any = '';
    item_NextQuestionId: number = 0;

    selectNextQuestion(event: any) {
        this.item_NextQuestion = event != null ? event.value : null;
        this.item_NextQuestionId =
            this.item_NextQuestion != null
                ? this.item_NextQuestion.question_id
                : 0;
    }

    ListSurveyAnswers: any = [];
    ListNextQuestion: any = [];
    _ListNextQuestion: boolean = false;

    LoadData() {
        if (this.question.show_detail == 1) {
            try {
                this.ListNextQuestion = [];

                this.inValue.forEach((element: any) => {
                    // element.next_question == 1 &&
                    if (element.question_id == this.question_id) {
                        this._ListNextQuestion = true;
                    }

                    // this.ListNextQuestion = [];
                    if (
                        (element.question_id != this.question_id &&
                            element.order >= this.question.order) ||
                        element.question_type == 'final'
                    ) {
                        this.ListNextQuestion.push({
                            question_id: element.question_id,
                            question_name: element.question_name,
                            Name:
                                element.question_id + ' - ' + element.question_name,
                        });
                    }
                    this.ListSurveyAnswers = [];
                    if (element.show_detail == 1) {
                        this.surveyService
                            .ewo_SurveyAnswers(this.question_id)
                            .subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    if (data.data.length > 0) {

                                        this.ListSurveyAnswers = data.data;
                                        console.log(this.ListSurveyAnswers);

                                        this.ListSurveyAnswers =
                                            this.ListSurveyAnswers.map((item: any) => ({
                                                ...item,
                                                _status:
                                                    item.status == 1 ? true : false,
                                                _listNextQuestion:
                                                    this.ListNextQuestion.filter(
                                                        (x: any) =>
                                                            x.question_id ==
                                                            item.next_question
                                                    ),
                                                answers_item: JSON.parse(item.answers_item)
                                            }));

                                    } else {
                                        this.message = 'No data';
                                        this.display = true;
                                    }
                                }
                            });
                    }

                });
            } catch (error) { }
        }
    }

    hideNextQuestion: boolean = true;
    ActionNextQuestion(value: any) {
        console.log(value);
        
        if (value.question_type == 'multi-select' && value.support_data == null && value.typeOf == 'int' ) {
            this.hideNextQuestion = false
        } else {
            this.hideNextQuestion = true;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue'] || changes['question_id'] || changes['question']) {

            this.ActionNextQuestion(this.question)
            if (this.question.show_detail == 1)
                this.LoadData();
        }
    }

    create() {
        this.AnswersCreate = true;
    }

    onRowEditInit(answer: Answers) {
        this.clonedAnswers[answer.answer_id as number] = { ...answer };
    }

    onRowEditSave(answer: Answers) {
        if (answer._listNextQuestion[0]) {
        } else {
            answer._listNextQuestion[0] = [];
        }

        // return;

        if (Helper.IsNull(answer.value) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a value',
            });
            return;
        }

        // this.item_NextQuestionId
        this.item_NextQuestion = '';

        this.surveyService
            .ewo_SurveyAnswersAction(
                answer.question_id,
                answer.value,"", 0,
                answer._status == true
                    ? (answer.status = 1)
                    : (answer.status = 0),
                answer._listNextQuestion[0].question_id,
                'update',
                answer.answer_id,
                ''
            )

            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data) {

                        this.NofiResult('Page Answers', 'Update answers', 'Update answers successfull', 'success', 'Successfull');

                        this.ListNextQuestion = [];
                        this.LoadData();
                    } else {
                        this.NofiResult('Page Answers', 'Update answers', 'Update answers error', 'error', 'Error');
                        return;
                    }
                }
            });

        this.clearMess = false;
    }

    onRowEditCancel(answer: Answers, index: number) {
        // this.answers[index] = this.clonedAnswers[answer.answer_id as number];
        delete this.clonedAnswers[answer.answer_id as number];
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success Create Answers',
        });
        this.AnswersCreate = newItem;
        this.LoadData();
    }

    addItemUpdate(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success Update Answers',
        });
        this.AnswersUpdate = newItem;
        this.LoadData();
    }


    AnswersUpdate: boolean = false;
    answerData: any = '';
    updateAnswer(answer: Answers) {
        // this.LoadData();
        this.AnswersUpdate = true;
        this.answerData = answer
    }

    NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
            life: 3000,
        });

        AppComponent.pushMsg(
            page,
            action,
            name,
            severity == 'success' ? EnumStatus.ok : EnumStatus.error,
            0
        );

    }

}
