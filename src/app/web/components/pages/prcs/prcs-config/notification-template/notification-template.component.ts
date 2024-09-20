import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PrcsService } from '../../service/prcs.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-notification-template',
    templateUrl: './notification-template.component.html',
    styleUrls: ['./notification-template.component.scss'],
})
export class NotificationTemplateComponent {
    messages: Message[] | undefined;

    openCreateNotificationTemplate: boolean = false;
    openEditNotificationTemplate: boolean = false;

    constructor(
        private router: Router,
        private _service: PrcsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    currentDate: any;

    menu_id = 101;
    items_menu: any = [
        { label: 'PROCESS ' },
        { label: ' Config', icon: 'pi pi-cog', routerLink: '/prcs/config' },
        { label: ' Config Notification Template', icon: 'pi pi-comment' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    check_permissions() {
        if (JSON.parse(localStorage.getItem('menu') + '') != null) {
            const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
                (item: any) => item.menu_id == this.menu_id && item.check == 1
            );
            if (menu.length > 0) {
            } else {
                this.router.navigate(['/empty']);
            }
        }
    }

    editTemplateNotificationId: any;
    editConnent: any;
    editTitle: any;
    editProjectId: any;

    connent: any = '';
    notificationContent: any = '';
    notificationTitle: any = '';
    editNotificationContent: any;
    editNotificationTitle: any;

    ngOnInit() {
        this.check_permissions();
        this.messages = [
            { severity: 'error', summary: 'Error', detail: 'Error!!!' },
        ];
        this.loadData(1);
    }

    isLoading_Filter: any = false;
    is_loadForm: number = 0;
    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
    listNotificationTemplate: any = [];
    loadData(pageNumber: number) {
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            this._pageNumber = 1;
        }
        this.isLoading_Filter = true;

        this._service
            .PrcGetNotificationTemplate(this.connent, Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.listNotificationTemplate =
                        data.data.notification_template_list;
                    this.totalRecords =
                        Helper.IsNull(this.listNotificationTemplate) !== true
                            ? this.listNotificationTemplate.length
                            : 0;
                    this.isLoading_Filter = false;
                } else {
                    this.listNotificationTemplate = [];
                    this.isLoading_Filter = false;
                }
            });
    }

    openNew() {
        this.openCreateNotificationTemplate = true;
    }
    saveCreateNotificationTemplate(event: any) {
        if (
            this.notificationContent === '' ||
            this.notificationContent === null
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Please fill in Notification Content!',
                detail: '',
            });
        } else {
            this._service
                .PrcNotificationTemplateAction(
                    0,
                    this.notificationContent,
                    this.notificationTitle,
                    Helper.ProjectID(),
                    'create'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.openCreateNotificationTemplate = false;
                        this.notificationContent = undefined;
                        this.notificationTitle = undefined;
                        this.loadData(1);
                        this.messageService.add({
                            severity: 'success',
                            summary:
                                'Add new Notification Template successfully',
                            detail: '',
                        });


                    } else {
                        this.openCreateNotificationTemplate = false;
                        this.messageService.add({
                            severity: 'danger',
                            summary: 'Error',
                            detail: '',
                        });
                    }
                });
        }
    }

    openEdit(item_raw: any) {
        this.openEditNotificationTemplate = true;
        this.editTemplateNotificationId = item_raw.template_notification_id;
        this.editNotificationContent = item_raw.connent;
        this.editNotificationTitle = item_raw.title;
        this.editProjectId = item_raw.project_id;
    }
    saveEditNotificationTemplate(event: any) {
        this._service
            .PrcNotificationTemplateAction(
                this.editTemplateNotificationId,
                (this.editConnent =
                    this.editNotificationContent === null
                        ? this.editConnent
                        : this.editNotificationContent),
                (this.editTitle =
                    this.editNotificationTitle === null
                        ? this.editTitle
                        : this.editNotificationTitle),
                this.editProjectId,
                'update'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.openEditNotificationTemplate = false;
                    this.loadData(1);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Update Notification Template successfully',
                        detail: '',
                    });
                } else {
                    this.openEditNotificationTemplate = false;
                    this.messageService.add({
                        severity: 'danger',
                        summary: 'Error',
                        detail: '',
                    });
                }
            });
    }

    openDelete(item_raw: any, event: any) {
        let id = item_raw.template_notification_id;
        let content = item_raw.connent;
        let projectId = item_raw.project_id;
        let title = item_raw.title;

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to delete it?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .PrcNotificationTemplateAction(
                        id,
                        content,
                        title,
                        projectId,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.loadData(1);
                            this.messageService.add({
                                severity: 'success',
                                summary:
                                    'Delete Notification Template successfully',
                                detail: '',
                            });
                        } else {
                            this.messageService.add({
                                severity: 'danger',
                                summary: 'Error',
                                detail: '',
                            });
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }
}
