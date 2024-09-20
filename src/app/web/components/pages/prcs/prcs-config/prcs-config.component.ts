import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PrcsService } from '../service/prcs.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
  selector: 'app-prcs-config',
  templateUrl: './prcs-config.component.html',
  styleUrls: ['./prcs-config.component.scss'],
})
export class PrcsConfigComponent {
  messages: Message[] | undefined;
  submitted: boolean = false;
  config_model: boolean = false;
  reloadTotalStep: boolean = false;
  newPrcsConfigDialog: boolean = false;
  editPrcsConfigDialog: boolean = false;
  openPrcsConfigDialog: boolean = false;

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
    { label: ' Config', icon: 'pi pi-cog' },
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

  editPrcId: any;

  editProjectId: any;

  newProcessId: any;
  editProcessId: any;

  newProcessName: any = '';
  editProcessName: any;

  isSendEmail: boolean = false;
  editIsSendEmail: any;

  isNotification: boolean = false;
  editIsNotification: any;

  totalStep: number = 0;
  editTotalStep: any;

  config: any;
  editConfig: any;

  filterProcess: any;
  filterProcesses: any = [];
  editInfoProcess: any;
  selectedFilterProcess(e: any) {
    this.filterProcess = e.value === null ? 0 : e.value.process_id;
  }

  configuration: any = [];

  notificationContent: any = "";
  noteContent: any = "";
  filterNoteContent: any;
  filterNoteContents: any = [];
  is_edit: any = 0;
  selectedFilterNoteContents(e: any) {
    this.filterNoteContent = e.value === null ? 0 : e.value.note;
    if (this.filterNoteContent === "Khác: ") {
      this.is_edit = 1;
    } else {
      this.is_edit = 0;
    }
  }

  reportStatus: any;
  filterStatus: any = 1;
  editStatus: any = -1;
  deleteStatus: any = -1;
  reportStatuses: any = [
    { name: 'Active', value: 1, icon: 'pi pi-check-circle' },
    { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' },
  ];
  filterStatuses: any = [
    { name: 'Active', value: 1, icon: 'pi pi-check-circle' },
    { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' },
  ];
  editStatuses: any = [
    { name: 'Active', value: 1, icon: 'pi pi-check-circle' },
    { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' },
  ];
  selectedStatus(e: any) {
    this.reportStatus = e.value === null ? -1 : e.value;
  }
  selectedFilterStatus(e: any) {
    this.filterStatus = e.value === null ? -1 : e.value;
  }
  selectedEditStatus(e: any) {
    this.editStatus = e.value === null ? -1 : e.value;
  }
  clearStatus() {
    this.reportStatus = -1;
  }
  clearFilterStatus() {
    this.filterStatus = -1;
  }

  itemsAction: any;
  ngOnInit() {
    this.check_permissions();
    this.messages = [
      { severity: 'error', summary: 'Error', detail: 'Error!!!' },
    ];
    this.loadProcess();
    this.loadData(1);

    this.itemsAction = [
      {
        label: 'Create Notification Template',
        icon: 'pi pi-comment',
        command: () => {
          this.viewNotificationTemplate();
        },
      },
      { separator: true },
      {
        label: 'Create Take Note',
        icon: 'pi pi-file-edit',
        command: () => {
          this.viewTakeNote();
        },
      },
      { separator: true },
      {
        label: 'Create Layout Template',
        icon: 'pi pi-plus',
        command: () => {
          this.viewLayoutTemplate();
        },
      }
    ];
  }

  loadProcess() {
    this._service
      .PrcGetMaster(Helper.ProjectID())
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          data.data.process_list.forEach((element: any) => {
            this.filterProcesses.push({
              process_id: element.process_id,
              process_name: element.process_name,
              type_process: element.type_process,
            });
          });
        }
      }
    );
  }

  loadDataPrcsDetail(event: any) { }

  loadNoteContent() {
    this._service.PrcGetNoteList(
      Helper.ProjectID(),
      0,
      "",
      0
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.filterNoteContents = data.data.note_list;
      }
    })
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
  listProcessProject: any = [];
  loadData(pageNumber: number) {
    this.is_loadForm = 1;
    if (pageNumber == 1) {
      this.first = 0;
      this.totalRecords = 0;
      this._pageNumber = 1;
    }
    this.isLoading_Filter = true;

    this._service
      .PrcGetprocesbyProjects(
        Helper.ProjectID(),
        this.newProcessId = this.filterProcess,
        this.filterStatus.value === undefined
          ? 1
          : this.filterStatus.value
      )
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          data.data.process_list.forEach((element: any) => {
            this.listProcessProject.push({
              ...element,
              total_step: this.totalStep,
              verified: element.status === 1 ? true : false
            })
          })
          // console.log(this.listProcessProject);
          this.listProcessProject = data.data.process_list;
          this.totalRecords =
            Helper.IsNull(this.listProcessProject) != true
              ? this.listProcessProject.length
              : 0;
          this.isLoading_Filter = false;
        } else {
          this.listProcessProject = [];
          this.isLoading_Filter = false;
        }
      });
  }

  openNew() {
    this.newPrcsConfigDialog = true;
  }
  openEdit(item_raw: any) {
    this.editPrcsConfigDialog = true;

    this.editPrcId = item_raw.Prc_id;
    this.editProjectId = item_raw.project_id;
    this.editProcessId = item_raw.process_id;
    this.editInfoProcess = this.filterProcesses?.find((item: any) => {
      return item.process_id === this.editProcessId
        ? JSON.stringify(item.process_name)
        : '';
    });
    this.editProcessName = item_raw.process_name;
    this.editIsSendEmail = item_raw.is_send_mail === 0 ? false : true;
    this.editIsNotification = item_raw.is_notification === 0 ? false : true;
    this.editConfig = item_raw.config;
    this.editStatus = item_raw.status;
  }
  openConfig(item_raw: any) {
    this.openPrcsConfigDialog = true;
    // console.log(item_raw);
    // console.log(JSON.stringify(JSON.parse(item_raw.config), null, 4));

    this.editPrcId = item_raw.Prc_id;
    this.editProjectId = item_raw.project_id;
    this.editProcessId = item_raw.process_id;
    this.editInfoProcess = this.filterProcesses?.find((item_raw: any) => {
      return item_raw.process_id === this.editProcessId
        ? JSON.stringify(item_raw.process_name)
        : '';
    });
    this.editProcessName = item_raw.process_name;
    this.editIsSendEmail = item_raw.is_send_mail === 0 ? false : true;
    this.editIsNotification = item_raw.is_notification === 0 ? false : true;
    this.editConfig = item_raw.config;
    this.editStatus = item_raw.status;
    this.configuration = item_raw;
    if (this.configuration.config !== "") {
      const parsedObject = JSON.parse(this.configuration.config);
      const formattedJSON = JSON.stringify(parsedObject, null, 4);
      this.configuration.config = formattedJSON;
      // console.log(this.configuration.config);
    }
  }
  openDelete(item_raw: any, event: any) {
    this.editPrcId = item_raw.Prc_id;
    this.editProjectId = item_raw.project_id;
    this.editProcessId = item_raw.process_id;
    this.editInfoProcess = this.filterProcesses?.find((item: any) => {
      return item.process_id === this.editProcessId
        ? JSON.stringify(item.process_name)
        : '';
    });
    this.editProcessName = item_raw.process_name;
    this.editIsSendEmail = item_raw.is_send_mail === 0 ? false : true;
    this.editIsNotification = item_raw.is_notification === 0 ? false : true;
    this.editConfig = item_raw.config;
    this.editStatus = item_raw.status;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._service
          .Prc_process_project_Action(
            this.editPrcId,
            this.editProjectId,
            this.editProcessId,
            this.editProcessName,
            this.editIsSendEmail === false ? 0 : 1,
            this.editIsNotification === false ? 0 : 1,
            (this.editConfig = ''),
            this.editStatus === 0 || this.editStatus === 1
              ? this.editStatus
              : this.editStatus.value,
            'delete'
          )
          .subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
              this.loadData(1);
              this.messageService.add({
                severity: 'success',
                summary: 'Delete Process Project successfully',
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
      } 
    });
  }

  resetNewInput() { }
  saveNewConfig(event: any) {
    this.submitted = true;
    this._service
      .Prc_process_project_Action(
        0,
        Helper.ProjectID(),
        (this.newProcessId = this.filterProcess),
        this.newProcessName,
        this.isSendEmail === false ? 0 : 1,
        this.isNotification === false ? 0 : 1,
        (this.config = ''),
        this.reportStatus.value,
        'create'
      )
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.newPrcsConfigDialog = false;
          this.submitted = false;

          // clear value
          this.filterProcess = undefined;
          this.newProcessId = undefined;
          this.newProcessName = undefined;
          this.isSendEmail = false;
          this.isNotification = false;
          this.config = undefined;
          this.reportStatus = undefined;

          this.loadData(1);
          this.messageService.add({
            severity: 'success',
            summary: 'Add new Process Project successfully',
            detail: '',
          });
        } else {
          this.newPrcsConfigDialog = false;
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: '',
          });
        }
      });
  }

  saveEditConfig(event: any) {
    this._service
      .Prc_process_project_Action(
        this.editPrcId,
        this.editProjectId,
        this.editProcessId,
        this.editProcessName,
        this.editIsSendEmail === false ? 0 : 1,
        this.editIsNotification === false ? 0 : 1,
        this.editConfig = '',
        this.editStatus === 0 || this.editStatus === 1
          ? this.editStatus
          : this.editStatus.value,
        'update'
      )
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.editPrcsConfigDialog = false;
          this.submitted = false;

          this.loadData(1);

          this.messageService.add({
            severity: 'success',
            summary: 'Edit Process Project successfully',
            detail: '',
          });
        } else {
          this.editPrcsConfigDialog = false;
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: '',
          });
        }
      }
      );
  }
  updateConfig() {
    this._service
      .Prc_process_project_Action(
        this.editPrcId,
        this.editProjectId,
        this.editProcessId,
        this.editProcessName,
        this.editIsSendEmail === false ? 0 : 1,
        this.editIsNotification === false ? 0 : 1,
        this.editConfig = this.configuration.config,
        this.editStatus === 0 || this.editStatus === 1
          ? this.editStatus
          : this.editStatus.value,
        'update'
      )
      .subscribe((data: any) => {
        this.openPrcsConfigDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Success Configuration Process',
        });
      }
      );
  }

  rerenderTotalStep(event: any) {
    this.totalStep = event;
    this.loadData(1)
  }

  // Notification template
  viewNotificationTemplate() {
    this.router.navigate(['/prcs/notification-template']);
  }
  // Note content
  viewTakeNote() {
    this.router.navigate(['/prcs/note-list']);
  }
  // Create Template
  viewLayoutTemplate() {
    this.router.navigate(['/prcs/layout-template']);
  }

  showFilter: number = 1;
  ShowHideFilter() {
    if (this.showFilter == 1) {
      this.showFilter = 0;
    } else {
      this.showFilter = 1;
    }
  }

  GetLanguage(key: string) {
    return Helper.GetLanguage(key);
  }

  checkTriggerStatus(event: any) {
    console.log(event);
    this.reloadTotalStep = event;
  }
  someObject(item: any) {
    try {
      return JSON.parse(item);
    } catch (e) {
      return item;
    }
  }
  checkSomeObject(item: any) {
    try {
      let t = JSON.parse(item);
      return 0;
    } catch (e) {
      return 1;
    }
  }
}
