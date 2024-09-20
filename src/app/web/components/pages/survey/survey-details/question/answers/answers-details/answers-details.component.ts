import {
    Component,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { AppComponent } from 'src/app/app.component';
import { SurveyService } from 'src/app/web/service/survey.service';
import { Pf } from 'src/app/_helpers/pf';

@Component({
    selector: 'app-answers-details',
    templateUrl: './answers-details.component.html',
    styleUrls: ['./answers-details.component.scss'],
})
export class AnswersDetailsComponent {
    constructor(
        private messageService: MessageService,
        private surveyService: SurveyService
    ) { }

    ngOnInit() { }

    @Input() action: any = 'create';
    @Input() inValue: any;
    @Input() survey_item: any = undefined;
    @Input() dataAnswer: any;
    @Input() question_id: any;
    @Input() question: any;
    @Input() visible: any;
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Output() newItemEventUpdate = new EventEmitter<boolean>();
    @Input() clearMess: any;

    ListStoreRouter = [];

    _status!: boolean;

    value!: string;
    point: any = null;
    percent: any = null;

    quicktest!: string;
    status!: number;
    next_question!: number;

    item_NextQuestion: any = '';
    item_NextQuestionId: number = 0;

    listQuestion: any;
    // itemQuestion_type itemTypeOf

    list_action: any = [
        {
            action_id: 1,
            question_type: 'number',
            support_data: 'int',
            typeOf: 'int',
            action: 'Nhập số nguyên',
            show: false,
            allow: false,
            label: '',
            min_data: undefined,
            max_data: undefined,
            data: 1,
        },
        {
            action_id: 2,
            question_type: 'number',
            support_data: 'decimal',
            typeOf: 'decimal',
            action: 'Nhập số - thập phân',
            show: false,
            allow: false,
            label: '',
            min_data: undefined,
            max_data: undefined,
            data: 1,
        },
        {
            action_id: 3,
            question_type: 'text',
            support_data: 'string',
            typeOf: 'string',
            action: 'Nhập nội dụng',
            show: false,
            allow: false,
            label: '',
            data: 0,
        },
        {
            action_id: 4,
            question_type: 'text',
            support_data: 'date',
            typeOf: 'string',
            action: 'Chọn ngày',
            show: false,
            allow: false,
            label: '',
            data: 0,
        },
        // {
        //     action_id: 5,
        //     question_type: 'text',
        //     support_data: 'time',
        //     typeOf: 'string',
        //     action: 'Chọn giờ',
        //     show: false,
        //     allow: false,
        //     label: '',
        //     data: 0,
        // },
        {
            action_id: 6,
            question_type: 'text',
            support_data: 'datetime',
            typeOf: 'string',
            action: 'Chọn ngày - giờ',
            show: false,
            allow: false,
            label: '',
            data: 0,
        },
        {
            action_id: 7,
            question_type: 'qr',
            support_data: 'string',
            typeOf: 'string',
            action: 'Quét QR',
            show: false,
            allow: false,
            label: '',
            data: 0,
        },
        {
            action_id: 8,
            question_type: 'image',
            support_data: null,
            typeOf: 'string',
            action: 'Chụp hình',
            show: false,
            allow: false,
            label: '',
            min_data: undefined,
            max_data: undefined,
            data: 1,
        },
    ];
    value_answer: string = ''
    supportCreateMulAnswer() {
        const multiline_string = this.value_answer + '';
        const mul = multiline_string.split('\n')

        this.value = mul.join("|")
    }
    check(): any {
        let check = 0;
        this.list_action
            .filter((item: any) => item.show != false)
            .map((data: any) => {
                (data._show = data.show.length == 1 ? 1 : 0),
                    (data._allow = data.allow.length == 1 ? 1 : 0);
            });

        this.list_action
            .filter((item: any) => item.show != false)
            .forEach((data: any) => {
                if (check == 0) {
                    if (data.data == 1) {
                        if (
                            this.NofiIsNull(
                                data.label,
                                'label (' + data.action + ')'
                            ) == 1 ||
                            this.NofiIsNull(
                                data.min_data,
                                'min_data (' + data.action + ')'
                            ) == 1 ||
                            this.NofiIsNull(
                                data.max_data,
                                'max_data (' + data.action + ')'
                            ) == 1 ||
                            (data.action_id != 2 &&
                                this.checkNumber(
                                    data.min_data,
                                    'Min_data (' + data.action + ')'
                                ) == 1) ||
                            (data.action_id != 2 &&
                                this.checkNumber(
                                    data.max_data,
                                    'Max_data (' + data.action + ')'
                                ) == 1) ||
                            this.compare(
                                data.min_data,
                                data.max_data,
                                'MaxData',
                                'min_data'
                            ) == 1 ||
                            (data.action_id == 2 &&
                                this.checkDecimal(
                                    data.min_data,
                                    'Min_data (' + data.action + ')'
                                ) == 1) ||
                            (data.action_id == 2 &&
                                this.checkDecimal(
                                    data.max_data,
                                    'Max_data (' + data.action + ')'
                                ) == 1)
                        ) {
                            check = 1;
                            return;
                        } else {
                            check = 0;
                        }
                    } else {
                        if (
                            this.NofiIsNull(
                                data.label,
                                'label (' + data.action + ')'
                            ) == 1
                        ) {
                            check = 1;
                        } else {
                            check = 0;
                        }
                    }
                }
            });
        return check;
    }
    // msgsInfo: Message[] = [];

    hideNextQuestion: boolean = true;
    ActionNextQuestion(value: any) {
        if (value.question_type == 'multi-select' && value.support_data == null && value.typeOf == 'int') {
            this.hideNextQuestion = false
        } else {
            this.hideNextQuestion = true;
        }
    }
    ngOnChanges(changes: SimpleChanges): void {
        // console.log('survey_item', this.survey_item);
        // console.log('dataAnswer', this.dataAnswer);

        if (changes['inValue'] || changes['dataAnswer'] || changes['action'] || changes['question'] || changes['visible']) {
            try {
                this.ActionNextQuestion(this.question);

                this.item_NextQuestion =
                    this.dataAnswer._listNextQuestion != null
                        ? this.dataAnswer._listNextQuestion[0]
                        : '';

                this.item_NextQuestionId =
                    this.item_NextQuestion != null
                        ? this.item_NextQuestion.question_id
                        : 0;

                this.list_action.forEach((clear: any) => {
                    clear.show = false;
                    clear.allow = false;
                    clear.label = '';
                    clear.min_data = undefined;
                    clear.max_data = undefined;
                });
                this.list_action.forEach((element: any) => {
                    if (this.dataAnswer != null)
                        this.dataAnswer.answers_item.forEach((item: any) => {
                            if (
                                element.action_id == item.action_id &&
                                item.show == 1
                            ) {
                                element.show = item.show == 1 ? ['1'] : false;
                                element._show = item.show;

                                element.allow = item.allow == 1 ? ['1'] : false;
                                element._allow = item.allow;

                                element.label = item.label;
                                element.min_data = item.min_data;
                                element.max_data = item.max_data;
                            }
                        });
                });

            } catch (error) { }
        }

        // question_type :         "select"
        // this.item_NextQuestion = {question_id: 0, question_name: '', Name: ''}
    }

    selectNextQuestion(event: any) {
        this.item_NextQuestion = event != null ? event.value : null;
        this.item_NextQuestionId =
            this.item_NextQuestion != null
                ? this.item_NextQuestion.question_id
                : 0;
    }
    clear() {
        this.value = '';
        this.item_NextQuestion = '';
        this.item_NextQuestionId = 0;
        this.list_action = [
            {
                action_id: 1,
                question_type: 'number',
                support_data: 'int',
                typeOf: 'int',
                action: 'Nhập số nguyên',
                show: false,
                allow: false,
                label: '',
                min_data: undefined,
                max_data: undefined,
                data: 1,
            },
            {
                action_id: 2,
                question_type: 'number',
                support_data: 'decimal',
                typeOf: 'decimal',
                action: 'Nhập số - thập phân',
                show: false,
                allow: false,
                label: '',
                min_data: undefined,
                max_data: undefined,
                data: 1,
            },
            {
                action_id: 3,
                question_type: 'text',
                support_data: 'string',
                typeOf: 'string',
                action: 'Nhập nội dung',
                show: false,
                allow: false,
                label: '',
                data: 0,
            },
            {
                action_id: 4,
                question_type: 'text',
                support_data: 'date',
                typeOf: 'string',
                action: 'Chọn ngày',
                show: false,
                allow: false,
                label: '',
                data: 0,
            },
            {
                action_id: 5,
                question_type: 'text',
                support_data: 'time',
                typeOf: 'string',
                action: 'Chọn giờ',
                show: false,
                allow: false,
                label: '',
                data: 0,
            },
            {
                action_id: 6,
                question_type: 'text',
                support_data: 'datetime',
                typeOf: 'string',
                action: 'Chọn ngày - giờ',
                show: false,
                allow: false,
                label: '',
                data: 0,
            },
            {
                action_id: 7,
                question_type: 'qr',
                support_data: 'string',
                typeOf: 'string',
                action: 'Quét QR',
                show: false,
                allow: false,
                label: '',
                data: 0,
            },
            {
                action_id: 8,
                question_type: 'image',
                support_data: null,
                typeOf: 'string',
                action: 'Chụp hình',
                show: false,
                allow: false,
                label: '',
                min_data: undefined,
                max_data: undefined,
                data: 1,
            },
        ];
    }

    actionAnswers(action: any) {

        const check = this.check();
        if (
            check == 1 ||
            this.NofiIsNull(
                action == 'create' ? this.value : this.dataAnswer.value,
                'value'
            ) == 1
        ) {
            return;
        } else {
            const listAnswers: any = [];

            this.list_action.forEach((element: any) => {
                if (element.show != false) {
                    listAnswers.push({
                        action_id: element.action_id,
                        question_type: element.question_type,
                        support_data: element.support_data,
                        typeOf: element.typeOf,
                        action: element.action,
                        show: element.show.length == 1 ? 1 : 0,
                        allow: element.allow.length == 1 ? 1 : 0,
                        label: element.label,
                        min_data: element.min_data,
                        max_data: element.max_data,
                    });
                }
            });

            this.surveyService
                .ewo_SurveyAnswersAction(
                    this.question_id,
                    action == 'create' ? this.value : this.dataAnswer.value,
                    action == 'create' ? "" : this.dataAnswer.quick_test ?? "",
                    action == 'create' ? 0 : this.dataAnswer.point === "" ? null : this.dataAnswer.point,
                    action == 'create' ? 1 : this.dataAnswer.status,
                    this.item_NextQuestionId,
                    action,
                    action == 'create' ? 0 : this.dataAnswer.answer_id,
                    listAnswers
                )

                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data) {

                            AppComponent.pushMsg(
                                'Page Answers',
                                action + ' answers',
                                'Successful ' + action + 'answers',
                                EnumStatus.info,
                                0
                            );

                            this.clearMess = true;
                            if (action == 'create') {
                                this.clear();
                                this.addNewItem();
                            } else {
                                this.addNewItemUpdate();
                            }

                            return;
                        } else {

                            this.NofiResult('Page Answers', action + ' answers', 'Error ' + action + ' answers', 'error', 'Error');

                            return;
                        }
                    }
                });
        }
    }

    addNewItem() {
        this.newItemEvent.emit(false);
    }
    addNewItemUpdate() {
        this.newItemEventUpdate.emit(false);
    }

    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (value == 0) {
            value += '';
        }
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }

    // Price
    checkNumber(value: any, name: any): any {
        let check = 0;
        if (Helper.number(value) != true && Helper.IsNull(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    checkDecimal(value: any, name: any): any {
        let check = 0;
        if (
            Helper.checkDecimal(value) != true &&
            Helper.IsNull(value) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }
    compare(min: any, max: any, nameMax: any, nameMin: any): any {
        let check = 0;
        if (min > max) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail:
                    nameMax +
                    ' value must be greater than or equal to ' +
                    nameMin,
            });
            check = 1;
        }
        return check;
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
