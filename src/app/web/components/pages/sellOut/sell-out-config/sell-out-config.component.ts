import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { SellOutService } from 'src/app/web/service/sell-out.service';

@Component({
  selector: 'app-sell-out-config',
  templateUrl: './sell-out-config.component.html',
  styleUrls: ['./sell-out-config.component.scss']
})
export class SellOutConfigComponent {

  currentDate: any;
  messages: { severity: string; summary: string; detail: string; }[] | undefined;

  constructor(
    private router: Router,
    private _service: SellOutService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  newSelloutDialog: boolean = false;
  editSelloutDialog: boolean = false;

  menu_id = 103;
  items_menu: any = [
    { label: 'SELLOUT ' },
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

  inputQuantity: any = false;
  editInputQuantity: any;

  inputPrice: any = false;
  editInputPrice: any;

  addProduct: any = false;
  editAddProduct: any;

  selloutResult: any = false;
  editSelloutResult: any;

  photoItem: any = false;
  editPhotoItem: any;

  systemPrice: any = false;
  editSystemPrice: any = false;

  infoCustomer: any = "";
  editInfoCustomer: any;

  GetLanguage(key: string) {
    return Helper.GetLanguage(key);
  }

  isLoading_Filter: any = false;

  editConfigId: any;
  // Project
  projectId: number = 0;
  filterProject: any = 0;
  filterProjects: any = [];
  editProjectId: any;
  editInfoProject: any;

  listSellOut: any = [];

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

  // Get
  loadData(pageNumber: number) {
    this.listSellOut = []
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

    this._service.Config_sellout_GetList(
      this.projectId,
      intDateStart,
      intDateEnd
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        data.data.configuration.forEach((element: any) => {
          this.listSellOut.push({
            ...element,
            InfoCustomer: element.info_customer.slice(2).slice(0, -2).split('","')
          })
        })
        this.totalRecords = Helper.IsNull(this.listSellOut) != true ? this.listSellOut.length : 0;
        console.log(this.listSellOut);
        this.isLoading_Filter = false;
      } else {
        this.listSellOut = [];
        this.isLoading_Filter = false;
      }
    })
  }

  // Action add
  openAddForm() {
    this.newSelloutDialog = true;
  }
  resetNewSelloutDialog() { }
  resetEditSelloutDialog() {
    this.infoCustomerEditArr = []
  }
  resetInputNewSellout() { }
  resetInputEditSellout() { }

  infoCustomerArr: any = [
    { key: 'info_mobile', name: 'Info Mobile', title: 'Thêm key info_mobile' },
    { key: 'info_name', name: 'Info Name', title: 'Thêm key info_name' },
    { key: 'info_address', name: 'Info Address', title: 'Thêm key info_address' },
    { key: 'province_district_ward', name: 'Province District Ward', title: 'Thêm key province_district_ward' }
  ]

  selectedItemCustomerArr: any = null;
  selectedInfoCustomer(event: any) {
    this.selectedItemCustomerArr = event.value === null ? 0 : event.value;
    this.inputInfoCustomer = this.selectedItemCustomerArr;
  }

  selectedItemCustomerEditArr: any = null;
  selectedInfoCustomerEdit(event: any) {
    this.selectedItemCustomerEditArr = event.value === null ? 0 : event.value;
    this.inputInfoCustomer = this.selectedItemCustomerEditArr;
  }

  onClearType() {
    this.inputInfoCustomer = [];
    this.infoCustomerArr = [];
  }

  infoCustomerEditArr: any = [];
  inputInfoCustomer: any = [];
  editInputInfoCustomer: any = [];

  saveNewSellout(event: any) {
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
      console.log(this.inputInfoCustomer);
      this.inputInfoCustomer = this.inputInfoCustomer.map((item: any) => {
        return item.key;
      })
      this._service.Config_sellout_Action(
        0,
        this.projectId,
        this.activeDateInt !== undefined ? parseInt(Pf.StringDateToInt(this.activeDateInt)) : 0,
        this.inputQuantity === false ? 0 : 1,
        this.inputPrice === false ? 0 : 1,
        this.addProduct === false ? 0 : 1,
        this.selloutResult === false ? 0 : 1,
        this.photoItem === false ? 0 : 1,
        this.systemPrice === false ? 0 : 1,
        this.inputInfoCustomer = this.inputInfoCustomer === "" ? "" : JSON.stringify(this.inputInfoCustomer),
        'create'
      ).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.newSelloutDialog = false;
          this.loadData(1);

          // clear value
          this.filterProject = "";
          this.activeDateInt = "";
          this.inputQuantity = undefined;
          this.inputPrice = undefined;
          this.addProduct = undefined;
          this.selloutResult = undefined;
          this.photoItem = undefined;
          this.systemPrice = undefined;
          this.inputInfoCustomer = [];
          this.infoCustomerArr = [];

          this.messageService.add({
            severity: 'success',
            summary: 'Add new Sellout Config successfully',
            detail: '',
          })
        } else {
          this.newSelloutDialog = false;
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: '',
          });
        }
      })
    }
  }
  saveEditSellout(event: any) {
    this.inputInfoCustomer = this.infoCustomerEditArr?.map((item: any) => {
      return item.key;
    })
    let x = this.infoCustomerEditArr.map((item: any) => {
      return item.key
    })
    this._service.Config_sellout_Action(
      this.editConfigId,
      this.editProjectId,
      this.editActiveDate !== undefined ? parseInt(Pf.StringDateToInt(this.editActiveDate)) : 0,
      this.editInputQuantity === false ? 0 : 1,
      this.editInputPrice === false ? 0 : 1,
      this.editAddProduct === false ? 0 : 1,
      this.editSelloutResult === false ? 0 : 1,
      this.editPhotoItem === false ? 0 : 1,
      this.editSystemPrice === false ? 0 : 1,
      this.inputInfoCustomer = this.inputInfoCustomer === undefined ? JSON.stringify(this.inputInfoCustomer) : JSON.stringify(x),
      'update'
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.editSelloutDialog = false;
        this.loadData(1);

        // clear value
        this.inputInfoCustomer = "";

        this.messageService.add({
          severity: 'success',
          summary: 'Edit Sellout Config successfully',
          detail: '',
        })
      } else {
        this.editSelloutDialog = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }

  // Action Edit
  openEditForm(
    item_raw: any
  ) {
    this.editSelloutDialog = true;

    this.editConfigId = item_raw.id;
    this.editProjectId = item_raw.project_id;
    this.editActiveDate = item_raw.active_date;
    this.editInputQuantity = item_raw.input_quantity === 0 ? false : true
    this.editInputPrice = item_raw.input_price === 0 ? false : true
    this.editAddProduct = item_raw.add_product === 0 ? false : true
    this.editSelloutResult = item_raw.sellout_result === 0 ? false : true
    this.editPhotoItem = item_raw.photo_item === 0 ? false : true
    this.editSystemPrice = item_raw.system_price === 0 ? false : true
    this.editInputInfoCustomer = item_raw.info_customer

    this.infoCustomerEditArr = this.infoCustomerArr.filter((item: { key: string; }) => {
      return JSON.parse(this.editInputInfoCustomer).some((editItem: string) => editItem === item.key);
    });
  }

  openDelete(
    ConfigId: number,
    ProjectId: number,
    ActiveDate: number,
    InputQuantity: number,
    InputPrice: number,
    AddProduct: number,
    SellOutResult: number,
    PhotoItem: number,
    SystemPrice: number,
    InfoCustomer: string,
    event: Event
  ) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._service.Config_sellout_Action(
          ConfigId,
          ProjectId,
          Helper.convertDateFormat(ActiveDate.toString()),
          InputQuantity,
          InputPrice,
          AddProduct,
          SellOutResult,
          PhotoItem,
          SystemPrice,
          InfoCustomer,
          "delete"
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.loadData(1);

            this.messageService.add({
              severity: 'success',
              summary: 'Delete Sellout Config successfully',
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
}
