import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { PrcsService } from '../../service/prcs.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { EmployeesService } from 'src/app/web/service/employees.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

interface EventItem {
    status?: string;
    date?: string;
    icon?: string;
    color?: string;
    image?: string;
}

@Component({
    selector: 'app-prcs-detail',
    templateUrl: './prcs-detail.component.html',
    styleUrls: ['./prcs-detail.component.scss'],
})
export class PrcsDetailComponent {
    @Input() inValue: any;
    @Input() finalTotalStep: any;
    @Input() action: any = 'view';
    @Output() outValue = new EventEmitter<any>();
    @Output() totalStep: EventEmitter<number> = new EventEmitter();
    @Output() triggerStatus: EventEmitter<boolean> = new EventEmitter();

    trigger: boolean = false;
    newPrcsDetailDialog: boolean = false;
    editPrcsDetailDialog: boolean = false;
    isLoadForm = 1;

    events!: EventItem[];
    items!: MenuItem[];
    activeIndex: number = 1;
    onActiveIndexChange(event: any) {
        this.activeIndex = event;
        this._service
            .PrcGetprocesbyProjectsDetail(
                Helper.ProjectID(),
                this.inValue.Prc_id
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    let itemSteps: MenuItem[] = [];
                    data.data.process_project_detail
                        .sort((a: any, b: any) => a.order - b.order)
                        .forEach((element: any, index: number) => {
                            itemSteps.push({
                                id: element.order,
                                label:
                                    element.desc + ' - ' + element.action_name,
                            });
                            element.index = index;

                            if (element.index == this.activeIndex) {
                                this.listProcessProjectDetail = [];
                                this.listProcessProjectDetail.push({
                                    ...element,
                                });
                                this.listProcessProjectStep =
                                    this.listProcessProjectDetail;
                            }
                        });
                    data.data.process_project_detail
                        .sort((a: any, b: any) => a.order - b.order)
                        .forEach((element: any, index: number) => {
                            this.listProcessProjectOrder.push(element.order);
                        });
                    this.loadAction();
                    this.loadLayout();
                    this.loadEmployee();
                    this.loadNotificationTemplate();
                    this.items = itemSteps;
                }
            });
    }

    constructor(
        private _service: PrcsService,
        private messageService: MessageService,
        private EmployeeService: EmployeesService,
        private edService: EncryptDecryptService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            if (Helper.IsNull(this.inValue) != true) {
                //this.listinValue = this.inValue
            }
        }
    }

    listProcessProjectDetail: any = [];
    listProcessProjectStep: any = [];
    listProcessProjectOrder: any = [];
    editListProcessProjectDetail: any = [];

    editStepId: any;

    filterAction: any = null;
    filterActions: any = [];
    editAction: any;
    oldActionId: any;
    editActions: any = [];
    selectedFilterAction(event: any) {
        this.filterAction = event.value === null ? 0 : event.value.action_id;
    }
    selectedEditAction(event: any) {
        this.editAction = event.value === null ? 0 : event.value.action_id;
    }

    filterLayout: any = null;
    filterLayouts: any = [];
    editLayout: any;
    oldLayoutId: any;
    editLayouts: any = [];
    selectedFilterLayout(event: any) {
        this.filterLayout = event.value === null ? 0 : event.value.layout_id;
    }
    selectedEditLayout(event: any) {
        this.editLayout = event.value === null ? 0 : event.value.layout_id;
    }

    filterEmployee: any = null;
    filterEmployees: any = [];
    editEmployee: any;
    oldEmployee: any;
    editEmployees: any = [];
    selectedFilterEmployee(event: any) {
        this.filterEmployee = event.value === null ? 0 : event.value.Id;
    }
    selectedEditEmployee(event: any) {
        this.editEmployee = event.value === null ? 0 : event.value.Id;
    }

    filterNotification: any = null;
    filterNotifications: any = [];
    editNotification: any;
    oldNotification: any;
    editNotifications: any = [];
    selectedFilterNotification(event: any) {
        this.filterNotification =
            event.value === null ? 0 : event.value.template_notification_id;
    }
    selectedEditNotification(event: any) {
        this.editNotification =
            event.value === null ? 0 : event.value.template_notification_id;
    }

    order: any = null;
    editOrder: any;
    desc: any;
    editDesc: any;

    ngOnInit(): void {
        this.onActiveIndexChange(0);
        this.events = [
            {
                status: 'Ordered',
                date: '15/10/2020 10:30',
                icon: 'pi pi-shopping-cart',
                color: '#9C27B0',
                image: 'game-controller.jpg',
            },
            {
                status: 'Ordered',
                date: '15/10/2020 10:30',
                icon: 'pi pi-shopping-cart',
                color: '#9C27B0',
                image: 'game-controller.jpg',
            },
        ];
    }

    loadAction() {
        this._service
            .PrcGetAction(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.filterActions = data.data.action_list;
                    this.editActions = data.data.action_list;
                }
            });
    }
    loadLayout() {
        this._service
            .PrcGetLayout(Helper.ProjectID())
            .subscribe((data: any) => {
                let filterLayoutArr: any = [];
                let editLayoutArr: any = [];
                if (data.result == EnumStatus.ok) {
                    data.data.layout_list.filter((element: any) => {
                        if (element.process_id === this.inValue.process_id) {
                            filterLayoutArr.push({
                                layout_id: element.layout_id,
                                layout_name: element.layout_name,
                                layout_image: element.layout_image,
                                layout_type: element.layout_type,
                                action_type: element.action_type,
                                process_id: element.process_id,
                                url_api: element.url_api,
                            });
                            this.filterLayouts = filterLayoutArr;

                            editLayoutArr.push({
                                layout_id: element.layout_id,
                                layout_name: element.layout_name,
                                layout_image: element.layout_image,
                                layout_type: element.layout_type,
                                action_type: element.action_type,
                                process_id: element.process_id,
                                url_api: element.url_api,
                            });
                            this.editLayouts = editLayoutArr;
                        }
                    });
                }
            });
    }
    loadEmployee() {
        this.EmployeeService.ewo_GetEmployeeType().subscribe((data: any) => {
            this.isLoadForm = 0;
            let filterEmployeeArr: any = [];
            let editEmployeeArr: any = [];
            if (data.result == EnumStatus.ok) {
                data.data.forEach((element: any) => {
                    filterEmployeeArr.push({
                        Id: element.employee_type_id,
                        employee_type_name: element.employee_type_name,
                        Name:
                            '[' +
                            element.employee_type_id +
                            '] - ' +
                            ' ' +
                            element.employee_type_code +
                            ' - ' +
                            element.employee_type_name +
                            ' - ' +
                            element.company +
                            ' - ' +
                            element.level,
                        role: element.role,
                        company: element.company,
                        level: element.level,
                        parent: element.parent,
                    });
                    this.filterEmployees = filterEmployeeArr;

                    this.editEmployees.push({
                        Id: element.employee_type_id,
                        Name:
                            '[' +
                            element.employee_type_id +
                            '] - ' +
                            ' ' +
                            element.employee_type_code +
                            ' - ' +
                            element.employee_type_name +
                            ' - ' +
                            element.company +
                            ' - ' +
                            element.level,
                        role: element.role,
                        company: element.company,
                        level: element.level,
                        parent: element.parent,
                    });
                    this.editEmployees = editEmployeeArr;
                });
            }
        });
    }
    loadNotificationTemplate() {
        this._service
            .PrcGetNotificationTemplate('', Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // console.log(data);
                    this.filterNotifications =
                        data.data.notification_template_list;
                    this.editNotifications =
                        data.data.notification_template_list;
                }
            });
    }

    openAdd() {
        this.newPrcsDetailDialog = true;
    }
    openEdit(item_raw: any) {
        this.editPrcsDetailDialog = true;

        this.editStepId = item_raw.step_id;
        this.oldActionId = item_raw.action_id;
        this.oldLayoutId = item_raw.layout_id;
        this.oldEmployee = item_raw.employee_type_action;
        this.editOrder = item_raw.order;
        this.editDesc = item_raw.desc;
        this.editNotification = item_raw.template_notification_id;
    }
    openDelete(item_raw: any, event: any) {
        this.editStepId = item_raw.step_id;
        this.oldActionId = item_raw.action_id;
        this.oldLayoutId = item_raw.layout_id;
        this.oldEmployee = item_raw.employee_type_action;
        this.editOrder = item_raw.order;
        this.editDesc = item_raw.desc;
        this.editNotification = item_raw.template_notification_id;

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .Prc_process_step_Action(
                        this.inValue.Prc_id,
                        this.editStepId,
                        this.oldActionId,
                        this.oldLayoutId,
                        this.oldEmployee,
                        this.editOrder,
                        this.editDesc,
                        this.editNotification === null
                            ? 0
                            : this.editNotification,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.onActiveIndexChange(0);
                            this.totalStep.emit(this.items.length - 1);
                            this.newPrcsDetailDialog = false;

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Delete Process Step successfully',
                                detail: '',
                            });
                        }
                    });
            },
        });
    }

    saveNewStep(event: any) {
        if (
            this.filterAction === null &&
            this.filterLayout === null &&
            this.filterEmployee === null &&
            this.filterNotification === null &&
            this.order === null
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please complete all information!',
                detail: '',
            });
        } else if (this.filterAction === null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please select Action!',
                detail: '',
            });
        } else if (this.filterLayout === null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please select Layout!',
                detail: '',
            });
        } else if (this.filterEmployee === null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please select Employee Type!',
                detail: '',
            });
        } else if (this.filterNotification === null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please select Notification Template!',
                detail: '',
            });
        } else if (this.items.length === 0 && this.order === 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please fill in Order!',
                detail: '',
            });
        } else if (
            this.listProcessProjectOrder.some(
                (item: any) => item === this.order
            )
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Order has been duplicated!',
                detail: '',
            });
        } else {
            this._service
                .Prc_process_step_Action(
                    this.inValue.Prc_id,
                    0,
                    this.filterAction,
                    this.filterLayout,
                    this.filterEmployee,
                    // +this.order || 1,
                    this.listProcessProjectStep.length + 1,
                    this.desc,
                    this.filterNotification,
                    'create'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.onActiveIndexChange(this.items.length);
                        this.totalStep.emit(this.items.length + 1);
                        this.newPrcsDetailDialog = false;
                        this.trigger = true;
                        this.triggerStatus.emit(this.trigger);

                        // clear value
                        this.filterAction = undefined;
                        this.filterLayout = undefined;
                        this.filterEmployee = undefined;
                        this.order = undefined;
                        this.desc = undefined;

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Add new Process Step successfully',
                            detail: '',
                        });
                    }
                });
        }
    }

    saveEditStep(event: any) {
        this._service
            .Prc_process_step_Action(
                this.inValue.Prc_id,
                this.editStepId,
                this.editAction === undefined
                    ? this.oldActionId
                    : this.editAction,
                this.editLayout === undefined
                    ? this.oldLayoutId
                    : this.editLayout,
                this.editEmployee === undefined
                    ? this.oldEmployee
                    : this.editEmployee,
                this.editOrder,
                this.editDesc,
                this.editNotification === undefined
                    ? this.oldNotification
                    : this.editNotification,
                'update'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.editPrcsDetailDialog = false;

                    // clear value
                    this.filterAction = undefined;
                    this.filterLayout = undefined;
                    this.filterEmployee = undefined;
                    this.editOrder = undefined;
                    this.editDesc = undefined;
                    this.filterNotification = undefined;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Edit Process Step successfully',
                        detail: '',
                    });
                    this.onActiveIndexChange(0);
                }
            });
    }

    urlGallery: any;
    showImageProduct(url: any) {
        this.urlGallery = url;
        document.open(
            <string>this.urlGallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;
    loadUser() {
        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.currentUser.employee[0]._status =
                this.currentUser.employee[0].status == 1 ? true : false;
            this.userProfile = this.currentUser.employee[0];
        }
    }

    increaseTotalStep() {
        this.inValue.total_step++;
        this.totalStep.emit(this.inValue.total_step);
    }
}
