import {
    Component,
    Input,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    ConfirmationService,
    FilterMatchMode,
    FilterService,
    Message,
    MessageService,
    SelectItem,
} from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import {
    EnumLocalStorage,
    EnumStatus,
    EnumSystem,
} from 'src/app/Core/_enum';
import { Router } from '@angular/router';
import { SurveyService } from 'src/app/web/service/survey.service';
import { Survey } from 'src/app/web/models/survey';
import { MastersService } from 'src/app/web/service/masters.service';
import { ExportService } from 'src/app/web/service/export.service';
import { AppComponent } from 'src/app/app.component';
import { Pf } from 'src/app/_helpers/pf';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { FileService } from 'src/app/web/service/file.service';
import { PromotionService } from 'src/app/web/service/promotion.service';

@Component({
    selector: 'app-survey-details',
    templateUrl: './survey-details.component.html',
    styleUrls: ['./survey-details.component.scss'],
    providers: [ConfirmationService],
})
export class SurveyDetailsComponent implements OnInit {
    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' Survey', icon: 'pi pi-table', routerLink: '/survey' },
        { label: ' Config', icon: 'pi pi-wrench' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    menu_id = 34;
    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    matchModeOptions: SelectItem[];
    constructor(
        private router: Router,
        private messageService: MessageService,
        private _service: SurveyService,
        private _servicePromotion: PromotionService,
        private _serviceMater: MastersService,
        private serviceExport: ExportService,
        private edService: EncryptDecryptService,
        private confirmationService: ConfirmationService,
        private _file: FileService,
    ) {
        this.matchModeOptions = [
            { label: 'Contains', value: FilterMatchMode.CONTAINS },
        ];
    }

    @Input() inValue: any;
    @Input() action: any = 'view';
    visible: boolean = false;
    surveyTask: any;
    master_position: any;
    select_position: any;
    master_category: any;
    select_category: any;
    employee_config: any;
    config_model: boolean = false;
    config_model_quicktest: boolean = false;
    employee_list: any = ''
    count_question: any
    config_item: any;
    quicktest_survey: any;
    UpdateEmployeeQuickTest() {
        // console.log('count_question', this.count_question);
        // console.log('employee_list', this.employee_list);
        // console.log('survey_id', this.quicktest_survey);
        if (this.count_question < 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Vui lòng nhập số từ 0 trở lên',
            });
            return
        }
        if (this.count_question == undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Vui lòng nhập số từ 0 trở lên',
            });
            return
        }
        if (this.employee_list == null || this.employee_list == '' || this.employee_list == undefined) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Vui lòng mã nhân viên',
            });
            return
        }
        this._service.employee_quicktest_action(Helper.ProjectID(), this.employee_list, this.quicktest_survey, this.count_question).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {


                this.employeeListQuickTest = data.data.result
                this.employee_list = undefined
                this.count_question = undefined


            }

        })

    }
    updateRule() {
        this._service
            .ewo_Survey_answers_GetCalConfig_action(
                this.config_item.survey_id,
                this.config_item.rule
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Success Config Survey',
                    });
                }
            });
    }
    employeeListQuickTest: any
    showQuickTestModal(survey: any) {
        this._service.GET_employee_quicktest(Helper.ProjectID(), survey.survey_id).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.employeeListQuickTest = data.data.result
                this.quicktest_survey = survey.survey_id
                this.config_model_quicktest = true
            }
        })
    }
    showDialogconfig_model(item: any) {
        this.config_model = true;
        this.config_item = item;
        // console.log(this.config_item);
        try {
            const parsedObject = JSON.parse(this.config_item.configuration);
            const formattedJSON = JSON.stringify(parsedObject, null, 4);
            this.config_item.configuration = formattedJSON;
        } catch (error) { }
        try {
            const parsedObject = JSON.parse(
                this.config_item.nextquestion_configuration
            );
            // const formattedJSON = JSON.stringify(parsedObject, null, 4);
            this.config_item.nextquestion_configuration = parsedObject;
            this._service
                .ewo_Survey_answers_GetCalConfig(item.survey_id)
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        data.data.data_question.forEach((element: any) => {
                            element.rule = JSON.parse(element.rule);
                        });
                        if (data.data.data_question.length > 0) {
                            this.CallConfig(
                                data.data.data,
                                data.data.data_question,
                                item
                            );
                        }
                    }
                });
        } catch (error) { }
    }
    CallConfig(data: any, data_question: any, item: any) {
        let maxOrder = -1;

        for (let item of data) {
            if (item.order > maxOrder) {
                maxOrder = item.order;
            }
        }
        data_question.forEach((dq: any) => {
            data.forEach((d: any) => {
                if (
                    dq.order_question + 1 <= d.order &&
                    d.order <= dq.order_next_question
                ) {
                    dq.rule.push(1);
                } else {
                    dq.rule.push(0);
                }
            });
        });
        const rule: any = [];
        data_question.forEach((element: any) => {
            rule.push(element.rule);
        });
        const numColumns = rule[0].length;

        // Initialize the result array with zeros
        const _Array = new Array(numColumns).fill(0);

        // Iterate through the columns and find the maximum value for each column
        for (let col = 0; col < numColumns; col++) {
            for (let row = 0; row < rule.length; row++) {
                _Array[col] = Math.max(_Array[col], rule[row][col]);
            }
        }
        const resultArray: any = [];
        for (let index = 0; index < _Array.length; index++) {
            const element = _Array[index];
            resultArray.push({
                order: index + 1,
                rule: element,
            });
        }

        const order_rule: any = [];
        for (let index = 0; index < resultArray.length; index++) {
            const element = resultArray;
            order_rule.push({
                order: index + 1,
                rule: element,
            });
        }

        for (let index = 0; index < order_rule.length; index++) {
            order_rule[index].question_id = data.filter(
                (i: any) => i.order == order_rule[index].order
            )[0].question_id;

            let temp = order_rule[index].rule.filter(
                (item: any) => item.order > order_rule[index].order
            );
            temp.forEach((ii: any) => {
                ii.question_id = data.filter(
                    (i: any) => i.order == ii.order
                )[0].question_id;

                console.log(
                    '🚀 ~ file: survey-details.component.ts:183 ~ SurveyDetailsComponent ~ temp.forEach ~ ii:',
                    ii
                );
                console.log(
                    '🚀 ~ file: survey-details.component.ts:183 ~ SurveyDetailsComponent ~ temp.forEach ~ data:',
                    data
                );
            });
            try {
                let key_order = temp.filter((obj: any) => obj.rule === 0)[0]
                    .order;
                temp = temp.filter((item: any) => item.order < key_order);
            } catch (error) { }

            order_rule[index].sub_rule = temp;
            delete order_rule[index]['rule'];
        }
        item.nextquestion_configuration = order_rule;
        item.rule = JSON.stringify(order_rule);
    }
    someObject(item: any) {
        try {
            return JSON.parse(item);
        } catch (e) {
            return item;
        }
    }
    checksomeObject(item: any) {
        try {
            let t = JSON.parse(item);
            return 0;
        } catch (e) {
            return 1;
        }
    }

    showDialogTime(item: any) {
        this._service
            .ewo_Survey_Scheduler_GetItem(item.survey_id)
            .subscribe((data: any) => {
                this.selectedmonth = [];
                this.selectedweek = [];
                this.visible = true;
                this.surveyTask = item.survey_id;

                if (data.result == EnumStatus.ok) {
                    this.ingredient = data.data.type.filter(
                        (x: any) => x.check == 1
                    )[0].code;

                    this.master = data.data.master;
                    this.employee_config = data.data.emplyee_config[0];
                    this.select_position =
                        this.employee_config.employee_position != null
                            ? this.employee_config.employee_position.split(',')
                            : undefined;

                    this.select_category =
                        this.employee_config.employee_category != null
                            ? this.employee_config.employee_category.split(',')
                            : undefined;

                    this.master_position = this.master.filter(
                        (item: any) =>
                            item.ListCode == 'Employee.Position' &&
                            item.project_id == Helper.ProjectID()
                    );
                    this.master_category = this.master.filter(
                        (item: any) =>
                            item.ListCode == 'Employee.Category' &&
                            item.project_id == Helper.ProjectID()
                    );
                }
                if (this.ingredient == 'weekly') {
                    const week_data = data.data.week.filter(
                        (x: any) => x.check == 1
                    );
                    week_data.forEach((element: any) => {
                        this.selectedweek.push(element.code);
                    });
                }
                if (this.ingredient == 'monthly') {
                    const month_data = data.data.month.filter(
                        (x: any) => x.check == 1
                    );
                    month_data.forEach((element: any) => {
                        this.selectedmonth.push(element.code + '');
                    });
                }
            });
    }
    update_config() {
        this._service
            .ewo_Survey_form_configuration_Update(
                this.config_item.survey_id,
                this.checkaLineJson(this.config_item.configuration)
            )
            .subscribe((data: any) => {
                this.config_model = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Success Config Survey',
                });
            });
    }
    checkaLineJson(inputJSON: any) {
        try {
            const parsedObject = JSON.parse(inputJSON);
            const formattedJSON = JSON.stringify(parsedObject);
            return formattedJSON;
        } catch (error) {
            return inputJSON;
        }
    }

    update_task() {
        const formatted_week = this.selectedweek.join(',');
        const formatted_month = this.selectedmonth.join(',');
        const formatted_position =
            this.select_position != undefined
                ? this.select_position.join(',')
                : null;
        const formatted_category =
            this.select_category != undefined
                ? this.select_category.join(',')
                : null;
        if (this.ingredient == 'daily') {
            this._service
                .ewo_Survey_Scheduler(
                    this.surveyTask,
                    this.ingredient,
                    null,
                    null,
                    formatted_position,
                    formatted_category
                )
                .subscribe((data) => {
                    this.visible = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Success Create Survey',
                    });
                });
        } else if (this.ingredient == 'weekly') {
            this._service
                .ewo_Survey_Scheduler(
                    this.surveyTask,
                    this.ingredient,
                    formatted_week,
                    null,
                    formatted_position,
                    formatted_category
                )
                .subscribe((data) => {
                    this.visible = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Success Create Survey',
                    });
                });
        } else if (this.ingredient == 'monthly') {
            this._service
                .ewo_Survey_Scheduler(
                    this.surveyTask,
                    this.ingredient,
                    null,
                    formatted_month,
                    formatted_position,
                    formatted_category
                )
                .subscribe((data) => {
                    this.visible = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Success Create Survey',
                    });
                });
        }
    }
    ingredient!: string;
    master: any = [];
    selectedweek: string[] = [];
    selectedmonth: string[] = [];
    listmonth = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    listmonth1 = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    listmonth2 = ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

    msgsInfo: Message[] = [];
    survey_name!: string;

    message: string = '';
    display: boolean = false;

    isActive: string[] = [];
    isInActive: string[] = [];

    is_test: string[] = ['1'];
    SurveyCreate: boolean = false;
    SurveyUpdate: boolean = false;
    clearMess: boolean = true;

    item_SurveyType: number = 0;
    item_SurveyModelEdit: number = 0;
    selectSurveyType(event: any) {
        this.item_SurveyType = event != null ? event.Id : 0;
    }
    selectSurveyModelEdit(event: any) {
        this.item_SurveyModelEdit = event != null ? event.Value : 0;
    }

    ListSurvey: any = [];
    ListMaster: any = [];

    statuses!: any;

    LoadData() {
        this.statuses = [
            { label: 'Active', value: 1 },
            { label: 'In Active', value: 0 },
        ];

        this.ListSurvey = [];

        this._service
            .ewo_GetSurveyList(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListSurvey = data.data;
                        this.ListSurvey = this.ListSurvey.map((item: any) => ({
                            ...item,
                            _status: item.status == 1 ? true : false,
                        }));
                        this._serviceMater
                            .ewo_GetMaster(Helper.ProjectID())
                            .subscribe((master: any) => {
                                if (master.result == EnumStatus.ok) {
                                    this.ListMaster = master.data;
                                    this.ListSurvey.forEach((element: any) => {
                                        const survey_type_name =
                                            this.ListMaster.filter(
                                                (x: any) =>
                                                    x.ListCode ==
                                                    'survey_type' &&
                                                    x.Id == element.survey_type
                                            );
                                        if (survey_type_name.length > 0) {
                                            element.survey_type_name =
                                                survey_type_name[0].Code +
                                                ' - ' +
                                                survey_type_name[0].NameEN;
                                        } else {
                                            element.survey_type_name = '';
                                        }
                                    });
                                }
                            });
                    }

                    // console.log(this.ListSurvey);

                    // this.ListSurvey = []
                } else {
                    this.message = 'No data';
                    this.display = true;
                    this.ListSurvey = []
                }
            });
    }


    currentUser: any;
    template_clone: any = 'assets/template/Clone_Question.xlsx';
    ngOnInit(): void {
        this.projectName();
        this.loadUser();
        this.checkActionUser();

        let newDate = new Date();
        this.template_clone += '?v=' + newDate.toUTCString();
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];
        this.check_permissions();
        this.LoadData();
    }

    displayQuestion: boolean = false;
    onDisplay() {
        this.displayQuestion == false ? true : false;
    }

    showLinkedRisksOnly = true;
    myModelChanged(value: any) { }

    create() {
        this.SurveyCreate = true;
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success Create Survey',
        });
        this.LoadData();
        this.SurveyCreate = newItem;
    }
    addListSurvey(newItem: any) {
        this.ListSurvey = newItem;
    }

    update() {
        this.SurveyUpdate = true;
    }

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 10;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
    }
    confirm(event: Event, survey: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.Ondelete(survey);
            },
            reject: () => { },
        });
    }

    Ondelete(survey: any) {
        this._service
            .ewo_SurveyFormAction(
                Helper.ProjectID(),
                survey.survey_name,
                survey.order,
                0,
                this.item_SurveyType,
                this.item_SurveyModelEdit,
                'delete',
                survey.survey_id
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data) {

                        this.NofiResult('Page Survey', 'Delete form survey', 'Delete form survey successfull', 'success', 'Successfull');

                        this.ListSurvey = data.data;
                        this.LoadData();
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Delete form survey error',
                        });

                        return;
                    }
                }
            });
    }
    createSurvey() { }
    checkAccountTest(value: any) {
        // this.checked == false ?  this.inValue.is_test = 0 :  this.inValue.is_test = 1 ;
    }

    surveys!: Survey[];
    clonedSurveys: { [s: number]: Survey } = {};

    onRowEditInit(survey: Survey) {
        this.clonedSurveys[survey.survey_id as number] = { ...survey };
        this.item_SurveyType = survey.survey_type;
    }

    onRowEditSave(survey: any) {
        if (
            this.NofiIsNull(survey.survey_name, 'survey name') == 1 ||
            this.NofiIsNull(survey.order, 'order') == 1 ||
            this.checkNumber(survey.order, 'Order') == 1 ||
            this.NofiIsNullSurveyType(this.item_SurveyType, 'survey type') == 1
        ) {
            return;
        } else {
            if (this.item_SurveyType == 0) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please enter a survey type',
                });
                return;
            }

            // console.log(this.item_SurveyModelEdit);
            this._service
                .ewo_SurveyFormAction(
                    Helper.ProjectID(),
                    survey.survey_name,
                    survey.order,
                    survey._status == true
                        ? (survey.status = 1)
                        : (survey.status = 0),
                    this.item_SurveyType,
                    this.item_SurveyModelEdit,
                    'update',
                    survey.survey_id
                )

                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data) {
                            survey.survey_type = data.data[0].survey_type;
                            console.log(survey.survey_type);
                            survey.survey_type_name = data.data[0].survey_type_name;
                            survey.model_edit = data.data[0].model_edit
                            survey = data.data[0];
                            this.NofiResult('Page Survey', 'Survey form is updated', 'Survey form is updated successfull', 'success', 'Successfull');

                            // this.LoadData();
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Survey form is updated error',
                            });

                            return;
                        }
                    }
                });
        }
        this.clearMess = false;
    }

    onRowEditCancel(survey: Survey, index: number) {
        // this.surveys[index] = this.clonedSurveys[survey.survey_id as number];
        delete this.clonedSurveys[survey.survey_id as number];
    }

    export() {
        this.serviceExport.ewo_Survey_Export(Helper.ProjectID());
    }

    userProfile: any
    loadUser() {

        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        );
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];


    }
    checkAction: boolean = false
    checkActionUser(): any {
        // console.log('this.userProfile ', this.userProfile)
        if (Helper.IsNull(this.userProfile) != true) {
            this.checkAction = this.userProfile.employee_type_id == 1 ? true : false
        } else {
            this.checkAction = false
        }
    }
    promotion_id!: number;
    formula_file_js: any = null;
    fileUpload: any;
    url: any = '';
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }

    onUploadFormulaFile(event: any, survey_id: any) {

        this.fileUpload = event.target.files[0];
        if (Helper.IsNull(this.fileUpload) != true) {

            if (this.NofiFileUpload(this.fileUpload.name.split('.').pop(), 'Formula File') == 1) {
                this.clearFormulaFile();
                this.url = null;
                return;
            } else {
                console.log(this.fileUpload);
                const formUploadImage = new FormData();
                formUploadImage.append('files', this.fileUpload);
                formUploadImage.append('ImageType', this.fileUpload.name);

                const fileName = AppComponent.generateGuid();
                const newFile = new File([this.fileUpload], fileName + this.fileUpload.name.substring(this.fileUpload.name.lastIndexOf('.')), { type: this.fileUpload.type });
                const modun = 'FORMULA-FILE';
                const drawText = this.fileUpload.name;

                this._file
                    .FileUpload(newFile, this.project.project_code, modun, drawText)
                    .subscribe((response: any) => {
                        this.url = response.url;

                        this._service
                            .ewo_Survey_form_formulaFile_Update(
                                survey_id,
                                this.url
                            ).subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    this.formula_file_js = this.url;
                                    // this.btnDelete = true;

                                    this.NofiResult('Page Survey', 'Edit Formula JS file of Survey', 'Edit the Formula JS file of Survey Success', 'success', 'Successful');
                                } else {
                                    this.NofiResult('Page Survey', 'Edit Formula JS file of Survey', 'Edit the Formula JS file of Survey Error', 'error', 'Error');
                                }
                                this.clearFormulaFile();
                            })

                    },
                        (error: any) => {
                            this.url = null;
                            this.clearFormulaFile();
                        });
            }
        }
        else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file upload',
            });
            return;
        }
    }

    // btnDelete!: boolean;
    openDelete(item_rawData: any, event: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .ewo_Survey_form_formulaFile_Update(
                        this.config_item.survey_id,
                        null
                    ).subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.formula_file_js = null;
                            this.config_item.formula_file_js = null;
                            // this.btnDelete = false;

                            this.NofiResult('Page Survey', 'Delete Formula JS file of Survey', 'Delete the Formula JS file of Survey Success', 'success', 'Successful');
                        } else {
                            this.NofiResult('Page Survey', 'Delete Formula JS file of Survey', 'Delete the Formula JS file of Survey Error', 'error', 'Error');
                        }
                        this.clearFormulaFile();
                    })
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            }
        })
    }

    @ViewChild('myInputFormulaFile') myInputImage: any;
    clearFormulaFile() {
        try {
            this.myInputImage.nativeElement.value = null;
            // this.url = null;
        } catch (error) { }
    }

    NofiFileUpload(value: any, name: any): any {
        let check = 0;
        if (value != 'js') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    NofiIsNullSurveyType(value: any, name: any): any {
        let check = 0;
        if (value == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }

    NofiIsNullSurveyModelEdit(value: any, name: any): any {
        let check = 0;
        if (value == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
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
