import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';

// Services
import { InventoryService } from '../service/inventory.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';

@Component({
  selector: 'app-inventory-config',
  templateUrl: './inventory-config.component.html',
  styleUrls: ['./inventory-config.component.scss'],
})
export class InventoryConfigComponent implements OnInit {
  @Input() itemEmployeeProject!: number;

  messages: Message[] | undefined;
  projectListId: any = [];
  selectedEmployeeProject: any;
  currentDate: any;

  constructor(
    private router: Router,
    private _service: InventoryService,
    private messageService: MessageService,
    private edService: EncryptDecryptService,
    private confirmationService: ConfirmationService,
  ) { }

  newInvenDialog: boolean = false;
  editInvenDialog: boolean = false;

  menu_id = 92;
  items_menu: any = [
    { label: 'Inventory '},
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
  showFilter: number = 1;
  ShowHideFilter() {
    if (this.showFilter == 1) {
      this.showFilter = 0;
    } else {
      this.showFilter = 1;
    }
  }

  is_LoadForm: number = 0;
  isLoadForm = 1;
  currentUser: any;
  projectList: any;

  dateStart: any | undefined;
  dateEnd: any | undefined;
  activeDate: any;
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
  editId: any;

  beforeInput: boolean = false;
  editBeforeInput: any;

  afterInput: boolean = false;
  editAfterInput: any;

  reasonInput: boolean = false;
  editReasonInput: any;

  addProduct: boolean = false;
  editAddProduct: any;

  imageResult: any = false;
  editImageResult: any;

  imageByProduct: any = false;
  editImageByProduct: any;

  GetLanguage(key: string) {
    return Helper.GetLanguage(key);
  }

  isLoading_Filter: any = false;

  // Project
  projectId: number = 0;
  filterProject: any = 0;
  filterProjects: any = [];
  editProjectId: any;
  editInfoProject: any;

  listInventory: any = [];

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

  clearFilterType() { }

  loadData(pageNumber: number) {
    this.is_LoadForm = 1;
    this.first = 0;
    this.totalRecords = 0;
    this.isLoading_Filter = true;

    let intDateStart = 0
    let intDateEnd = 0

    this.dateStart == undefined || this.dateStart == "" ? intDateStart = 0 : intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    this.dateEnd == undefined || this.dateEnd == "" ? intDateEnd = 0 : intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    if (intDateEnd < intDateStart && intDateEnd !== 0) {
      this.dateStart = "";
      this.dateEnd = "";
      this.messageService.add({
        severity: 'warn',
        summary: 'The end date must be greater than the starting date!',
        detail: '',
      })
      return
    }

    this._service.Config_inventory_GetList(
      this.projectId,
      intDateStart,
      intDateEnd
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.listInventory = data.data.configuration;
        this.totalRecords = Helper.IsNull(this.listInventory) != true ? this.listInventory.length : 0
        this.isLoading_Filter = false;
      } else {
        this.listInventory = [];
        this.isLoading_Filter = false;
      }
    })
  }

  openAddForm() {
    this.newInvenDialog = true;
  }
  resetNewInvenDialog() {
    this.newInvenDialog = false;
  }
  saveNewInven(event: Event) {
    if (this.activeDateInt === undefined) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Please select Active Date',
        header: 'Error',
        icon: 'pi pi-exclamation-triangle',
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          document.getElementById("active_date_int")?.focus()
          close();
        },
        reject: () => {
          close();
        }
      });
    } else {
      this._service.Config_inventory_Add(
        this.projectId,
        this.activeDateInt !== undefined ? parseInt(Pf.StringDateToInt(this.activeDateInt)) : 0,
        this.beforeInput === false ? 0 : 1,
        this.afterInput === false ? 0 : 1,
        this.reasonInput === false ? 0 : 1,
        this.addProduct === false ? 0 : 1,
        this.imageResult === false ? 0 : 1,
        this.imageByProduct === false ? 0 : 1
      ).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.newInvenDialog = false;
          this.loadData(1);

          // clear value
          this.filterProject = "";
          this.activeDateInt = "";
          this.beforeInput = false;
          this.afterInput = false;
          this.reasonInput = false;
          this.addProduct = false;
          this.imageResult = false;
          this.imageByProduct = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Add new Inventory Config successfully',
            detail: '',
          })
        } else {
          this.newInvenDialog = false;
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: '',
          });
        }
      })
    }
  }
  resetInputNewInven() {
    this.activeDatesInt = this.listInventory.map((item: any) => item.active_date_int);

    this.filterProject = "";
    this.activeDateInt = "";
    this.beforeInput = false;
    this.afterInput = false;
    this.reasonInput = false;
    this.addProduct = false;
    this.imageResult = false;
    this.imageByProduct = false;
  }

  openEditForm(
    ID: any,
    ActiveDate: any,
    BeforeInput: any,
    AfterInput: any,
    ReasonInput: any,
    AddProduct: any,
    ImageResult: any,
    ImageByProduct: any
  ) {
    this.editInvenDialog = true;

    this.editId = ID
    this.editActiveDate = ActiveDate
    this.editBeforeInput = BeforeInput === 0 ? false : true
    this.editAfterInput = AfterInput === 0 ? false : true
    this.editReasonInput = ReasonInput === 0 ? false : true
    this.editAddProduct = AddProduct === 0 ? false : true
    this.editImageResult = ImageResult === 0 ? false : true
    this.editImageByProduct = ImageByProduct === 0 ? false : true
  }
  resetEditInvenDialog() {
    this.editInvenDialog = false;
  }
  saveEditInven() {
    this._service.Config_inventory_Update(
      this.projectId,
      this.editId,
      this.editBeforeInput === false ? 0 : 1,
      this.editAfterInput === false ? 0 : 1,
      this.editReasonInput === false ? 0 : 1,
      this.editAddProduct === false ? 0 : 1,
      this.editImageResult === false ? 0 : 1,
      this.editImageByProduct === false ? 0 : 1,
      "UPDATE"
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.editInvenDialog = false;
        this.loadData(1);

        this.messageService.add({
          severity: 'success',
          summary: 'Edit Inventory Config successfully',
          detail: '',
        })
      } else {
        this.editInvenDialog = true;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }
  resetInputEditInven() {
    this.activeDatesInt = this.listInventory.map((item: any) => item.active_date_int)
  }

  openDelete(
    ProjectId: any,
    Id: any,
    BeforeInput: any,
    AfterInput: any,
    ReasonInput: any,
    AddProduct: any,
    ImageResult: any,
    ImageByProduct: any,
    event: Event
  ) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._service.Config_inventory_Update(
          ProjectId,
          Id,
          BeforeInput,
          AfterInput,
          ReasonInput,
          AddProduct,
          ImageResult,
          ImageByProduct,
          "DELETE"
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.loadData(1);

            this.messageService.add({
              severity: 'success',
              summary: 'Delete Inventory Config successfully',
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
    this.filterProject = this.filterProjects.find((item: any) => item.Id == Helper.ProjectID()).Name;
    this.check_permissions();
    this.messages = [
      { severity: 'error', summary: 'Error', detail: 'Error!!!' },
    ];
    
    const today = new Date();
    let month = today.getMonth() + 1
    let monthString = month.toString().padStart(2, '0');
    let day = today.getDate()
    this.currentDate = parseInt(today.getFullYear() + monthString + day);
  }

  displayOOLItem: boolean = false;
  onDisplay() {
    this.displayOOLItem == false ? true : false;
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
      });
      // console.log(this.filterProjects);
      this.isLoadForm = 0;

    } catch (error) { }
  }
}
