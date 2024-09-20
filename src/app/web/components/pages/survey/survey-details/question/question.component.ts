import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Employee } from 'src/app/web/models/employee';
import { SurveyService } from 'src/app/web/service/survey.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    providers: [ConfirmationService],
})
export class QuestionComponent implements OnInit {
    employees!: Employee[];
    clonedEmployees: { [s: number]: Employee } = {};

    constructor(
        private messageService: MessageService,
        private surveyService: SurveyService,
        private edService: EncryptDecryptService,
        private confirmationService: ConfirmationService
    ) {}

    @Input() inValue: any;

    @Input() action: any = 'view';

    message: string = '';
    display: boolean = false;
    QuestionCreate: boolean = false;
    itemQuestionMasterCode!: number;

    clearMess: boolean = true;

    onRowEditInit(employee: Employee) {
        this.clonedEmployees[employee.employee_id as number] = { ...employee };
    }

    onRowEditSave() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee is updated',
        });
    }
    onRowEditCancel(employee: Employee, index: number) {
        this.employees[index] =
            this.clonedEmployees[employee.employee_id as number];
        delete this.clonedEmployees[employee.employee_id as number];
    }

    QuestionUpdate: boolean = false;
    questionDetail: any;
    update(item: any) {
        this.clearMessCreate = true;
        this.clearMessUpdate = false;
        this.questionDetail = item;
        this.QuestionUpdate = true;
    }

    QuestionClone: boolean = false;
    questionDetailClone: any;
    clone(item: any) {
        this.clearMessCreate = true;
        this.clearMessUpdate = true;
        this.questionDetailClone = item;
        this.QuestionClone = true;
    }
    confirm(event: Event, question: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.Ondelete(question);
            },
            reject: () => {},
        });
    }
    checkColGroup(data: any, col: string) {
        if (col == 'Group') {
            const check = data.filter((i: any) => (i.Group + '').length > 0);

            return check.length;
        } else if (col == 'question_group') {
            const check = data.filter(
                (i: any) => (i.question_group + '').length > 0
            );
            return check.length;
        } else if (col == 'desc') {
            const check = data.filter((i: any) => (i.desc + '').length > 0);

            return check.length;
        } else if (col == 'data') {
            const check = data.filter(
                (i: any) =>
                    i.min_value != null ||
                    i.max_value != null ||
                    i.is_comment == 1
            );

            return check.length;
        } else if (col == 'image') {
            const check = data.filter(
                (i: any) => i.min_image != null || i.max_image != null
            );

            return check.length;
        }
    }
    Ondelete(question: any) {
        this.surveyService
            .ewo_SurveyQuestionAction(
                this.inValue.survey_id,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                'delete',
                question.question_id,
                ''
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // question_name_master
                    if (data.data) {
                        try {
                            this.ListSurveyQuestion =
                                this.ListSurveyQuestion.filter(
                                    (item: any) =>
                                        item.question_id !==
                                        question.question_id
                                );

                            AppComponent.pushMsg(
                                'Page Question',
                                'Delete Question',
                                'Delete Question Successfull',
                                EnumStatus.info,
                                0
                            );
                        } catch (error) {}
                    } else {
                        this.NofiResult(
                            'Page Question',
                            'Delete Question',
                            'Delete Question Error',
                            'error',
                            'Error'
                        );

                        return;
                    }
                }
            });
    }
    questionDetailShow: any;
    questionDetailShowOption: any;
    questionDetailShowOption_Select: any;
    QuestionConditionModal: boolean = false;
    updateCondition(item: any) {
        const answerIds = item.option_select.map((item: any) => item.answer_id);
        const commaSeparatedIds = answerIds.join(',');
        item.option_select_condition = commaSeparatedIds;
        this.surveyService
            .ewo_question_ConditionShow_Update(
                item.question_id,
                commaSeparatedIds
            )
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    item.condition_show = commaSeparatedIds;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Success Update Condition',
                    });
                }
            });
        // out update
    }
    ConditionList: any = [
        { code: 'Contains', name: 'Contains' },
        { code: 'Not_Contains', name: 'Not Contains' },
        { code: '=', name: 'Equals' },
        { code: '!=', name: 'Not Equals' },
        { code: '>', name: '>' },
        { code: '<', name: '<' },
    ];
    selectcondition: any;
    questionConditionList: any = undefined;
    questionConditionList_select: any = undefined;
    condition_value: any = undefined;
    dataCondition: any = undefined;
    questionDetailShow_header = '';
    ConditionShow(item: any) {
        this.questionDetailShow = item;
        this.questionDetailShow.option = undefined;
        this.questionDetailShow.option_select = undefined;

        this.surveyService
            .ewo_question_ConditionShow(item.survey_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.QuestionConditionModal = true;

                    this.questionDetailShow_header =
                        'Condition question [' +
                        item.question_id +
                        '] - ' +
                        item.question_name;

                    const result = data.data.reduce((acc: any, item: any) => {
                        const { question_id, question_name, value, answer_id } =
                            item;

                        // Find if there is an existing entry for the question_id and question_name
                        const existingEntry = acc.find(
                            (entry: any) =>
                                entry.value === question_id &&
                                entry.label === question_name
                        );

                        if (existingEntry) {
                            existingEntry.items.push({
                                label: value,
                                answer_id,
                            });
                        } else {
                            if (
                                question_id !=
                                this.questionDetailShow.question_id
                            ) {
                                acc.push({
                                    value: question_id,
                                    label: question_name,
                                    items: [{ label: value, answer_id }],
                                });
                            }
                        }

                        return acc;
                    }, []);

                    this.questionDetailShow.option = result;

                    const condition_show = item.condition_show; // The condition string
                    if (
                        condition_show == null ||
                        condition_show == undefined ||
                        condition_show == ''
                    ) {
                        this.questionDetailShow.option_select = undefined;
                    } else {
                        const dataArray: any = [];
                        data.data.forEach((element: any) => {
                            dataArray.push({
                                label: element.value,
                                answer_id: element.answer_id,
                            });
                        });

                        // Convert the condition_show string to an array of integers
                        const conditionArray = condition_show
                            .split(',')
                            .map(Number);

                        // Filter the dataArray based on the conditionArray
                        const filteredData = dataArray.filter((item: any) =>
                            conditionArray.includes(item.answer_id)
                        );
                        this.questionDetailShow.option_select = filteredData;
                    }
                }
            });
        console.log(item);
        this.loadCondition(item.question_id);
    }
    loadCondition(question_id: any) {
        this.surveyService
            .Survey_condition_action(
                0,
                question_id,
                0,
                'condition',
                'value',
                'VIEW'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    console.log(data);
                    this.questionConditionList = undefined;
                    this.questionConditionList_select = undefined;
                    this.condition_value = undefined;
                    this.selectcondition = undefined;
                    this.questionConditionList = data.data.question_list;
                    this.dataCondition = undefined;
                    this.dataCondition = data.data.condition_list;
                }
            });
    }
    AddCondition(question_id: number) {
        try {
            this.surveyService
                .Survey_condition_action(
                    0,
                    question_id,
                    this.questionConditionList_select.code,
                    this.selectcondition.code,
                    this.condition_value,
                    'INSERT'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.loadCondition(question_id);
                    }
                });
        } catch (error) {}
    }
    DeleteCondition(question_id: number, id: number) {
        this.surveyService
            .Survey_condition_action(id, question_id, 0, '', 'value', 'DELETE')
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.loadCondition(question_id);
                }
            });
    }
    currentUser: any;
    ngOnInit(): void {
        let is_test = 0;
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];
        // this.LoadData();
    }

    create() {
        this.clearMessCreate = false;
        this.clearMessUpdate = true;

        this.QuestionCreate = true;
    }

    ListSurveyQuestion: any = [];
    ListNextQuestion: any = [];
    ListQuestionMaster: any = [];
    questionNameMaster!: any;

    clearMessCreate: boolean = true;
    clearMessUpdate: boolean = true;

    actionNextQuestion: string = '';
    hideAction: boolean = false;
    viewActionNextQuestion(value: any) {
        if (value.show_detail == 1) {
            value.show_detail = 0;
        } else {
            value.show_detail = 1;
            if (
                value._question_master[0].question_type == 'multi-select' ||
                value._question_master[0].question_type == 'select'
            ) {
                this.actionNextQuestion = 'view';
            } else {
                this.actionNextQuestion = 'nextQuestion';
            }
        }
        // *ngIf="question._question_master[0].question_type == 'multi-select' ||
        // question._question_master[0].question_type == 'select'"
    }

    LoadData() {
        try {
            this.ListSurveyQuestion = [];
            this.ListNextQuestion = [];
            this.ListQuestionMaster = [];

            const qus_master = JSON.parse(
                localStorage.getItem('QuestionMaster') + ''
            );

            if (qus_master != null && qus_master.length > 0) {
                qus_master.forEach((element: any) => {
                    this.ListQuestionMaster.push({
                        name: element.name,
                        question_type: element.question_type,
                        support_data: element.support_data,
                        typeOf: element.typeOf,
                    });
                });
                this.surveyService
                    .ewo_SurveyQuestion(this.inValue.survey_id)
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            if (data.data.length > 0) {
                                this.ListSurveyQuestion = data.data;
                                let colGroup = this.checkColGroup(
                                    this.ListSurveyQuestion,
                                    'Group'
                                );
                                let colQuestionGroup = this.checkColGroup(
                                    this.ListSurveyQuestion,
                                    'question_group'
                                );
                                let colDesc = this.checkColGroup(
                                    this.ListSurveyQuestion,
                                    'desc'
                                );
                                let colData = this.checkColGroup(
                                    this.ListSurveyQuestion,
                                    'data'
                                );
                                let colImage = this.checkColGroup(
                                    this.ListSurveyQuestion,
                                    'image'
                                );

                                this.ListSurveyQuestion =
                                    this.ListSurveyQuestion.map(
                                        (item: any) => ({
                                            ...item,
                                            showCol_group: colGroup,
                                            showCol_questiongroup:
                                                colQuestionGroup,
                                            showCol_desc: colDesc,
                                            showCol_data: colData,
                                            showCol_image: colImage,
                                            show_detail: 0,
                                            _status:
                                                item.status == 1 ? true : false,
                                            _is_comment:
                                                item.is_comment == 1
                                                    ? true
                                                    : false,
                                            _is_allow:
                                                item.is_allow == 1
                                                    ? true
                                                    : false,
                                            _next_question:
                                                item.next_question == 1
                                                    ? true
                                                    : false,
                                            _question_master:
                                                this.ListQuestionMaster.filter(
                                                    (x: any) =>
                                                        x.typeOf ==
                                                            item.typeOf &&
                                                        x.question_type ==
                                                            item.question_type &&
                                                        x.support_data ==
                                                            item.support_data
                                                ),
                                            stringQuestionMater:
                                                this.ListQuestionMaster.filter(
                                                    (x: any) =>
                                                        x.typeOf ==
                                                            item.typeOf &&
                                                        x.question_type ==
                                                            item.question_type &&
                                                        x.support_data ==
                                                            item.support_data
                                                )[0].name +
                                                ' - ' +
                                                this.ListQuestionMaster.filter(
                                                    (x: any) =>
                                                        x.typeOf ==
                                                            item.typeOf &&
                                                        x.question_type ==
                                                            item.question_type &&
                                                        x.support_data ==
                                                            item.support_data
                                                )[0].question_type,
                                        })
                                    );

                                this.ListSurveyQuestion =
                                    this.ListSurveyQuestion.map(
                                        (item: any) => ({
                                            ...item,
                                            stringQuestionName:
                                                item.question_id +
                                                ' - ' +
                                                item.question_name,
                                        })
                                    );
                            } else {
                                this.message = 'No data';
                                this.display = true;
                                this.ListSurveyQuestion = [];
                            }
                        }
                    });
            } else {
                this.surveyService
                    .SurveyQuestionMaster(Helper.ProjectID())
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            data.data.forEach((element: any) => {
                                this.ListQuestionMaster.push({
                                    name: element.name,
                                    question_type: element.question_type,
                                    support_data: element.support_data,
                                    typeOf: element.typeOf,
                                });
                            });
                            this.surveyService
                                .ewo_SurveyQuestion(this.inValue.survey_id)
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        if (data.data.length > 0) {
                                            this.ListSurveyQuestion = data.data;
                                            this.ListSurveyQuestion =
                                                this.ListSurveyQuestion.map(
                                                    (item: any) => ({
                                                        ...item,
                                                        show_detail: 0,
                                                        _status:
                                                            item.status == 1
                                                                ? true
                                                                : false,
                                                        _is_comment:
                                                            item.is_comment == 1
                                                                ? true
                                                                : false,
                                                        _is_allow:
                                                            item.is_allow == 1
                                                                ? true
                                                                : false,
                                                        _next_question:
                                                            item.next_question ==
                                                            1
                                                                ? true
                                                                : false,
                                                        _question_master:
                                                            this.ListQuestionMaster.filter(
                                                                (x: any) =>
                                                                    x.typeOf ==
                                                                        item.typeOf &&
                                                                    x.question_type ==
                                                                        item.question_type &&
                                                                    x.support_data ==
                                                                        item.support_data
                                                            ),
                                                    })
                                                );
                                        } else {
                                            this.message = 'No data';
                                            this.display = true;
                                        }
                                    }
                                });
                        }
                    });
            }
        } catch (error) {}
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            this.LoadData();
        }
    }

    statuses: any = [
        { label: 'Active', value: 1 },
        { label: 'In Active', value: 0 },
    ];

    Allow: any = [
        { label: 'Active', value: 1 },
        { label: 'In Active', value: 0 },
    ];
    nextQuestion: any = [
        { label: 'Active', value: 1 },
        { label: 'In Active', value: 0 },
    ];

    filter(pageNumber: number) {}

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 10;
    _pageNumber: number = 1;
    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.filter(this._pageNumber);
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success Update Question',
        });
        this.QuestionUpdate = newItem;
        this.LoadData();
    }
    addValue(value: any) {
        console.log(
            '🚀 ~ file: question.component.ts:215 ~ QuestionComponent ~ addValue ~ value:',
            value
        );
    }
    addItemCreate(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success Create Question',
        });
        this.QuestionCreate = newItem;
        this.LoadData();
    }

    addItemClone(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success Clone Question',
        });
        this.QuestionClone = newItem;
        this.LoadData();
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
