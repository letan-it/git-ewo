import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MessageService } from 'primeng/api';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { SurveyService } from 'src/app/web/service/survey.service';

@Component({
    selector: 'app-question-details',
    templateUrl: './question-details.component.html',
    styleUrls: ['./question-details.component.scss'],
})
export class QuestionDetailsComponent implements OnInit {
    constructor(
        private messageService: MessageService,
        private _service: SurveyService
    ) {}
    value: string = '';
    supportCreateMulQuestion() {
        const multiline_string = this.value + '';
        const mul = multiline_string.split('\n');

        this.question_name = mul.join('|');
    }

    valueClone: string = '';
    resultArray: any = []; 

    supportCreateMulClone( ) {
        const multiline_string = this.valueClone + '';
        const mul = multiline_string.split('\n'); 
        this.inValue.question_name = mul.join('|');
        this.resultArray = this.inValue.question_name.split('|'); 
        console.log ('resultArray : ', this.resultArray )
    }
    @Input() action: any = 'create';
    @Input() inValue: any;
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Output() newItemValue = new EventEmitter<string>();
    @Output() newItemEventCreate = new EventEmitter<boolean>();
    @Output() newItemEventClone = new EventEmitter<boolean>();

    // survey_id: number = this.inValue.survey_id;
    question_name!: string;
    desc: any = '';
    question_group: string = '';
    Group: string = '';

    question_name_master!: string;
    question_type!: string;
    support_data!: string;
    typeOf!: string;
    html_desc!: string;

    is_comment!: number;
    order!: any;
    min_value!: any;
    max_value!: any;
    min_image!: any;
    max_image!: any;
    is_allow!: number;
    next_question!: number;

    _status!: boolean;
    _is_comment!: boolean;
    _is_allow!: boolean;
    _next_question!: boolean;
    status: number = 0;

    item_QuestionMaster!: string;

    hideNextQuestion: boolean = true;
    // setup config library
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        translate: 'no',
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',

        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText',
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
    };
    selectQuestionMaster(event: any) {
        this.item_QuestionMaster = event != null ? event.Code : null;
        this.question_name_master = event != null ? event.Code : null;

        this.question_type = event != null ? event.question_type : null;
        this.support_data = event != null ? event.support_data : null;
        this.typeOf = event != null ? event.typeOf : null;

        if (this.question_type == 'final') {
            this.hideNextQuestion = false;
        } else {
            this.hideNextQuestion = true;
        }
    }

    // msgsInfo: Message[] = [];
    // msgsInfoCreate: Message[] = [];

    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges): void {
        if (this.question_type == 'final') {
            this.hideNextQuestion = false;
        } else {
            this.hideNextQuestion = true;
        }
    }

    clear() {
        this.question_name = '';
        this.html_desc = '';
        this.question_group = '';
        this.Group = '';
        this.desc = '';
        this.question_type = '';
        this.support_data = '';
        this.typeOf = '';
        this._is_comment = false;
        this.order = null;
        this.min_value = null;
        this.max_value = null;
        this.min_image = null;
        this.max_image = null;
        this._is_allow = false;
        this._next_question = false;
        this._status = false;
    }

    @Input() questionDetail: any;

    @Input() clearMessCreate: any;
    @Input() clearMessUpdate: any;

    createQuestion() {
        if (
            this.NofiIsNull(this.question_name, 'question name') == 1 ||
            this.NofiIsNull(this.item_QuestionMaster, 'question master') == 1 ||
            this.NofiIsNull(this.order, 'order') == 1 ||
            this.checkNumber(this.order, 'Order') == 1 ||
            this.checkDecimal(this.min_value, 'Min value') == 1 ||
            this.checkDecimal(this.max_value, 'Max value') == 1 ||
            this.checkNumber(this.min_image, 'Min image') == 1 ||
            this.checkNumber(this.max_image, 'Max image') == 1
        ) {
            return;
        } else {
            if (this.inValue.survey_id == 1) {
                this._next_question = false;
            }

            if (Helper.IsNull(this.desc) == true) {
                this.desc = '';
            }
            if (Helper.IsNull(this.question_group) == true) {
                this.question_group = '';
            }
            if (Helper.IsNull(this.Group) == true) {
                this.Group = '';
            }

            if (
                this.min_value > this.max_value &&
                Helper.IsNull(this.min_value) != true &&
                Helper.IsNull(this.max_value) != true
            ) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Min Value must be less than Max value',
                    life: 3000,
                });
                return;
            }
            if (
                this.min_image > this.max_image &&
                Helper.IsNull(this.min_image) != true &&
                Helper.IsNull(this.max_image) != true
            ) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Min Image must be less than Max Image',
                    life: 3000,
                });
                return;
            }

            this._status = true;
            if (
                this.question_type == '' ||
                this.question_type == '' ||
                this.typeOf == ''
            ) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please enter a question master',
                });
                return;
            }
            this._service
                .ewo_SurveyQuestionAction(
                    this.inValue.survey_id,
                    this.question_name,
                    this.question_group,
                    this.Group,
                    this.desc,
                    this.question_type,
                    this.support_data,
                    this.typeOf,
                    this._is_comment == true
                        ? (this.is_comment = 1)
                        : (this.is_comment = 0),
                    this.order,
                    this.min_value == undefined ? null : this.min_value,
                    this.max_value == undefined ? null : this.max_value,
                    this.min_image == undefined ? null : this.min_image,
                    this.max_image == undefined ? null : this.max_image,
                    this._is_allow == true
                        ? (this.is_allow = 1)
                        : (this.is_allow = 0),
                    this._next_question == true
                        ? (this.next_question = 1)
                        : (this.next_question = 0),
                    this._status == true
                        ? (this.status = 1)
                        : (this.status = 0),
                    'create',
                    0,
                    this.html_desc === null ? '' : this.html_desc
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        // question_name_master
                        if (data.data) {
                            try {
                                this.clear();
                                this.addNewItemCreate();

                                const result = data.data.map((item: any) => ({
                                    ...item,
                                    question_name_master:
                                        this.question_name_master,
                                }));

                                AppComponent.pushMsg(
                                    'Page Question',
                                    'Create Question',
                                    'Successfull Create Question',
                                    EnumStatus.info,
                                    0
                                );
                            } catch (error) {}
                        } else {
                            this.NofiResult(
                                'Page Question',
                                'Create Question',
                                'Error Create Question',
                                'error',
                                'Error'
                            );
                            return;
                        }
                    }
                });
        }
    }

    updateQuestion() {
        if (
            this.NofiIsNull(this.inValue.question_name, 'question name') == 1 ||
            this.NofiIsNull(this.inValue.order, 'order') == 1 ||
            this.checkNumber(this.inValue.order, 'Order') == 1 ||
            this.checkDecimal(this.inValue.min_value, 'Min value') == 1 ||
            this.checkDecimal(this.inValue.max_value, 'Max value') == 1 ||
            this.checkNumber(this.inValue.min_image, 'Min image') == 1 ||
            this.checkNumber(this.inValue.max_image, 'Max image') == 1
        ) {
            return;
        } else {
            if (Helper.IsNull(this.item_QuestionMaster) == true) {
                this.question_type = this.inValue.question_type;
                this.support_data = this.inValue.support_data;
                this.typeOf = this.inValue.typeOf;
            }

            if (
                this.inValue.min_value > this.inValue.max_value &&
                Helper.IsNull(this.inValue.min_value) != true &&
                Helper.IsNull(this.inValue.max_value) != true
            ) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Min Value must be less than Max value',
                    life: 3000,
                });
                return;
            }
            if (
                this.inValue.min_image > this.inValue.max_image &&
                Helper.IsNull(this.inValue.min_image) != true &&
                Helper.IsNull(this.inValue.max_image) != true
            ) {
                this.messageService.add({
                    severity: EnumStatus.warning,
                    summary: EnumSystem.Notification,
                    detail: 'Min Image must be less than Max Image',
                    life: 3000,
                });
                return;
            }

            this._service
                .ewo_SurveyQuestionAction(
                    this.inValue.survey_id,
                    this.inValue.question_name,
                    this.inValue.question_group == null
                        ? ''
                        : this.inValue.question_group,
                    this.inValue.Group == null ? '' : this.inValue.Group,
                    this.inValue.desc == null ? '' : this.inValue.desc,
                    this.question_type,
                    this.support_data,
                    this.typeOf,
                    this.inValue._is_comment == true
                        ? (this.inValue.is_comment = 1)
                        : (this.inValue.is_comment = 0),
                    this.inValue.order,
                    this.inValue.min_value,
                    this.inValue.max_value,
                    this.inValue.min_image,
                    this.inValue.max_image,
                    this.inValue._is_allow == true
                        ? (this.inValue.is_allow = 1)
                        : (this.inValue.is_allow = 0),
                    this.inValue._next_question == true
                        ? (this.inValue.next_question = 1)
                        : (this.inValue.next_question = 0),
                    this.inValue._status == true
                        ? (this.inValue.status = 1)
                        : (this.inValue.status = 0),
                    'update',
                    this.inValue.question_id,
                    this.inValue.html_desc === null ? '' : this.inValue.html_desc
                )

                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data) {
                            AppComponent.pushMsg(
                                'Page Question',
                                'Update Question',
                                'Update Question Successfull',
                                EnumStatus.info,
                                0
                            );
                            this.inValue._question_master[0].question_type =
                                data.data.question_type;
                            this.inValue._question_master[0].support_data =
                                data.data.support_data;
                            this.inValue._question_master[0].typeOf =
                                data.data.typeOf;

                            this.addNewItem();
                        } else {
                            this.NofiResult(
                                'Page Question',
                                'Update Question',
                                'Update Question Error',
                                'error',
                                'Error'
                            );
                            return;
                        }
                    }
                });
        }
    }

    // <!-- "question_group_new": "string",
    // "question_name_new": "string",
    // "desc_new": "string" -->

    question_group_new: any = '';
    question_name_new: any = '';
    desc_new: any = '';

    clearForm(value: any) {
        value = [];
    }
    clearClone() {
        this.inValue.question_name = null;
        this.valueClone = '';
        this.inValue.question_group = null;
        this.inValue.desc = null;
        
        // this.inValue = []
    }
    cloneQuestion() {
        if (this.NofiIsNull(this.inValue.question_name, 'Question Name') == 1) {
            return;
        } else {
            
            if ( Helper.IsNull(this.resultArray) != true  ){
                this.resultArray.forEach((element : any ) => {
                     
                    this._service
                    .ewo_Survey_question_Clone(
                        this.inValue.question_id,
                        this.inValue.survey_id,
                        this.inValue.question_group,
                        element,
                        this.inValue.desc
                    )
                    .subscribe((data: any) => {
                        this.clearClone();
                        this.addNewItemClone();
                    });
                });
            }else { 
                this._service
                .ewo_Survey_question_Clone(
                    this.inValue.question_id,
                    this.inValue.survey_id,
                    this.inValue.question_group,
                    this.inValue.question_name,
                    this.inValue.desc
                )
                .subscribe((data: any) => {
                    this.clearClone();
                    this.addNewItemClone();
                });
            }

            
        }
    }

    NofiIsNull(value: any, name: any): any {
        let check = 0;
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

    addNewItem() {
        this.newItemEvent.emit(false);
    }

    addNewItemCreate() {
        this.newItemEventCreate.emit(false);
    }

    addNewItemClone() {
        this.newItemEventClone.emit(false);
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
