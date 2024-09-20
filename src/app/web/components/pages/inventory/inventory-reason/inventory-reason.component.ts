import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';

// Services
import { InventoryService } from '../service/inventory.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
  selector: 'app-inventory-reason',
  templateUrl: './inventory-reason.component.html',
  styleUrls: ['./inventory-reason.component.scss'],
})
export class InventoryReasonComponent implements OnInit {
  @Input() itemEmployeeProject!: number;

  messages: Message[] | undefined;
  projectListId: any = [];
  selectedEmployeeProject: any;
  changeStatus: boolean = false;
  currentDate: any;

  constructor(
    private router: Router,
    private _service: InventoryService,
    private messageService: MessageService,
    private edService: EncryptDecryptService,
    private confirmationService: ConfirmationService,
  ) { }

  newReasonDialog: boolean = false;
  editReasonDialog: boolean = false;

  menu_id = 93;
  items_menu: any = [
    { label: 'Inventory '},
    { label: ' Reason', icon: 'pi pi-question-circle' },
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
  showFilter: number = 1;
  ShowHideFilter() {
    if (this.showFilter == 1) {
      this.showFilter = 0;
    } else {
      this.showFilter = 1;
    }
  }
  ChangeStatus() {
    this.changeStatus = !this.changeStatus;
  }

  is_LoadForm: number = 0;
  isLoadForm = 1;
  currentUser: any;
  projectList: any;

  dateStart: any | undefined;
  dateEnd: any | undefined;
  activeDatesInt: any = [];
  activeDateInt: any | undefined;
  editActiveDate: any | undefined;
  selectedActiveDate(e: any) {
    this.activeDateInt = e.value;
  }
  clearActiveDate() {
    this.activeDateInt = "";
  }

  checkedOrdersNotNegative: boolean = false;

  id: any;
  editReasonId: any;

  reasonName: any;
  editReasonName: any;
  filterReasonName: any;

  beforeInput: any;
  editBeforeInput: any;

  afterInput: any;
  editAfterInput: any;

  reasonInput: any;
  editReasonInput: any;

  imageResult: any;
  editImageResult: any;

  imageByProduct: any;
  editImageByProduct: any;

  GetLanguage(key: string) {
    return Helper.GetLanguage(key);
  }

  isLoading_Filter: any = false;

  projectId: number = 0;
  filterProject: any = 0;
  filterProjects: any = [];
  editProjectId: any;
  editInfoProject: any;
  selectedFilterProject(event: any) {
    this.filterProject = event.value === null ? 0 : event.value;
  }

  listReason: any = [];

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  clearFilterType() { }

  loadData(pageNumber: number) {
    this.first = 0;
    if (pageNumber == 1) {
        this.first = 0;
        this.totalRecords = 0;
        this._pageNumber = 1;
    }
    this.isLoading_Filter = true;

    this._service.Reasons_inventory_GetList(
      Helper.ProjectID(),
      this.reasonName === undefined ? "" : this.reasonName
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.listReason = data.data.reason_list;
        this.totalRecords = Helper.IsNull(this.listReason) != true ? this.listReason.length : 0
        this.isLoading_Filter = false;
      } else {
        this.listReason = [];
        this.isLoading_Filter = false;
      }
    })
  }

  openAddForm() {
    this.newReasonDialog = true;
  }
  resetNewReasonDialog() {
    this.newReasonDialog = false;
  }
  saveNewReason(event: Event) {
    this._service.Reasons_inventory_Action(
      Helper.ProjectID(),
      0,
      this.reasonName,
      "CREATE"
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.newReasonDialog = false;
        this.loadData(1);

        // clear value
        this.reasonName = "";
        
        this.messageService.add({
          severity: 'success',
          summary: 'Add new Inventory Reason successfully',
          detail: '',
        })
      } else {
        this.newReasonDialog = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    });
  }
  resetInputNewReason() {
    this.reasonName = "";
  }

  openEditForm(
    ProjectId: any,
    ReasonId: any,
    ReasonName: any,
  ) {
    this.editReasonDialog = true;

    this.editProjectId = ProjectId
    this.editInfoProject = this.filterProjects.find((item: any) => item.Id == ProjectId).Name;

    this.editReasonId = ReasonId
    this.editReasonName = ReasonName
  }
  resetEditInvenDialog() {
    this.editReasonDialog = false;
  }
  saveEditReason(event: Event) {
    this._service.Reasons_inventory_Action(
      this.editProjectId,
      this.editReasonId,
      this.editReasonName,
      "UPDATE"
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.editReasonDialog = false;
        this.loadData(1);

        // clear value
        this.reasonName = "";

        this.messageService.add({
          severity: 'success',
          summary: 'Update Inventory Reason successfully',
          detail: '',
        })
      } else {
        this.editReasonDialog = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }
  resetInputEditInven() {
    this.activeDatesInt = this.listReason.map((item: any) => item.active_date_int)
  }

  openDelete(
    ProjectId: any,
    ReasonId: any,
    ReasonName: any,
    event: Event
  ) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._service.Reasons_inventory_Action(
          ProjectId,
          ReasonId,
          ReasonName,
          "DELETE"
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.loadData(1);

            this.messageService.add({
              severity: 'success',
              summary: 'Delete Inventory Reason successfully',
              detail: '',
            })
          } else {
            this.messageService.add({
              severity: 'danger',
              summary: 'Error',
              detail: '',
            });
          }
        })
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

  ngOnInit() {
    this.projectId = Helper.ProjectID();

    this.loadData(1);
    this.LoadProjects();
    this.check_permissions();
    this.messages = [
      { severity: 'error', summary: 'Error', detail: '' },
    ];
  }

  LoadProjects() {
    try {
      this.isLoadForm = 1;
      let _u = localStorage.getItem(EnumLocalStorage.user);

      this.currentUser = JSON.parse(
        this.edService.decryptUsingAES256(_u)
      );
      this.projectList = this.currentUser.projects;
      this.projectList = this.projectList.map((item: any) => ({
        ...item,
        checked: false,
      }));

      this.projectListId = [];
      this.filterProjects = [];

      this.projectList.forEach((element: any) => {
        this.projectListId.push({
          project_id: element.project_id
        });
        this.filterProjects.push({
          Id: element.project_id,
          Image: element.image,
          Name:
            '[' +
            element.project_id +
            '] - ' +
            ' ' +
            element.project_code +
            ' - ' +
            element.project_name,
        });

        if (this.itemEmployeeProject > 0) {
          this.selectedFilterProject = this.filterProjects.filter((item: any) => item.Id == this.itemEmployeeProject)[0];
        } else {
          this.selectedEmployeeProject = '';
        }
      });
      // console.log(this.filterProjects);
      this.isLoadForm = 0;
    } catch (error) { }
  }
}
