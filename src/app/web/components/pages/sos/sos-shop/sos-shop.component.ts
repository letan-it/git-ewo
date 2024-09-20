import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { SosService } from '../services/sos.service';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { EnumStatus } from 'src/app/Core/_enum';
import * as FileSaver from 'file-saver';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-sos-shop',
  templateUrl: './sos-shop.component.html',
  styleUrls: ['./sos-shop.component.scss']
})
export class SosShopComponent {
  messages: Message[] | undefined;

  constructor(
    private router: Router,
    private _service: SosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  actionDialog: boolean = false;
  cloneDialog: boolean = false;

  menu_id = 98;
  items_menu: any = [
    { label: 'SOS '},
    { label: ' Shop', icon: 'pi pi-shopping-bag' },
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

  isLoading_Filter: any = false;
  is_LoadForm: number = 0;

  projectList: any;

  fromDate: any | undefined;
  toDate: any | undefined;
  activeDatesInt: any = [];
  activeDateInt: any | undefined;
  editActiveDate: any | undefined;
  selectedActiveDate(e: any) {
    this.activeDateInt = e.value;
  }
  clearActiveDate() {
    this.activeDateInt = "";
  }

  // Project

  // Shop Code
  shopCode: string = "";

  // SOS
  sosId: any = 0;
  sosName: any;
  listSOS: any;
  listSOSs: any = []; 
  selectedListSOS(event: any) {
    this.sosId = event.value === null ? 0 : event.value.id;
  }

  target: number | undefined;

  listInventoryShop: any = [];

  ListError: any = [];
  listSOSShop: any = [];

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this._pageNumber = (this.first + this.rows) / this.rows;
    this.loadData(this._pageNumber);
  }

  // Year month
  limitedFromDate: any | undefined;
  limitedToDate: any | undefined;
  limitedMaxDate: any = null;
  currentDate: any = null;
  listMonth: any = null;
  listMonths: any = [];
  year_month: any = null;
  date: any = null;
  created_date_int: any = null;
  orders: any = null
  selectedListMonths(e: any) {
    let currYear = e.value?.code.toString().substring(0, 4);
    let currMonth = e.value.month;
    let maxDayInMonth = e.value.totalDays;
    this.limitedFromDate = currYear + '-' + currMonth + '-' + '01';
    this.limitedToDate = currYear + '-' + currMonth;
    this.limitedMaxDate = currYear + '-' + currMonth + '-' + maxDayInMonth;
    this.listMonths.splice(0, +this.listMonth.month);
    this.listMonthsTo = this.listMonths;
    this.loadData(1);
  }
  getDate() {
    let today = new Date();
    this.date = new Date(today);
    this.setDate(this.date);
  }
  setDate(date: any) {
    if (Helper.IsNull(date) != true) {
      this.created_date_int = Helper.convertDate(new Date(date))
      this.created_date_int = Helper.transformDateInt(new Date(this.created_date_int))
    } else {
      this.created_date_int = null;
    }
  }

  // Year Month To
  listMonthTo: any = null;
  listMonthsTo: any = [];

  GetLanguage(key: string) {
    return Helper.GetLanguage(key);
  }

  loadSOSs() {
    this._service.Web_SOSList_GetList(
      Helper.ProjectID(),
      "", "", "", "", "", 1000000 , 1
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        data.data.forEach((element: any) => {
          this.listSOSs.push({
            name: `[${element.sos_id}] - ${element.sos_code} - ${element.sos_name}`,
            id: element.sos_id,
            product_code: element.sos_code,
            item_code: element.sos_code,
            item_name: element.sos_name
          })
        })
      }
      // if (this.itemProduct > 0) {
      //   this.selectedProduct = this.listProducts.filter(
      //     (item: any) => item.id == this.itemProduct
      //   )[0];
      // } else {
      //   this.selectedProduct = '';
      // }
    })
  }

  loadData(pageNumber: number) {
    this.is_LoadForm = 1;
    this.first = 0;
    this.totalRecords = 0;
    this.isLoading_Filter = true;

    let intDateStart = 0
    let intDateEnd = 0

    this.limitedFromDate == undefined || this.limitedFromDate == "" ? intDateStart = 0 : intDateStart = parseInt(Pf.StringDateToInt(this.limitedFromDate));
    this.toDate == undefined || this.toDate == "" ? intDateEnd = 0 : intDateEnd = parseInt(Pf.StringDateToInt(this.toDate));

    if (intDateEnd < intDateStart && intDateEnd !== 0) {
      this.limitedFromDate = "";
      this.toDate = "";
      this.messageService.add({
        severity: 'warn',
        summary: 'The end date must be greater than the starting date!',
        detail: '',
      })
      return
    }

    const date = new Date()
    const year = date.getFullYear();
    const monthToday = date.getMonth() + 1;
    const monthString = monthToday.toString().padStart(2, '0');
    this.currentDate = parseInt(year + monthString);
    for (let i = 1; i <= 12; i++) {
      const dataMonth = Helper.getMonth()
      this.listMonths = dataMonth.ListMonth;
    }

    this._service.SOS_Shop_GetList(
      Helper.ProjectID(),
      this.shopCode,
      this.sosId,
      this.listMonth === null ? 0 : this.listMonth.code,
      intDateStart,
      intDateEnd,
      this.rows,
      pageNumber
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.listSOSShop = data.data;

        this.totalRecords = Helper.IsNull(this.listSOSShop) != true ? this.listSOSShop[0].TotalRows : 0
        this.isLoading_Filter = false;
      } else {
        this.listSOSShop = [];
        this.isLoading_Filter = false;
      }
    })
  }

  openAction() {
    if (this.listMonth === null || this.limitedFromDate === undefined || this.sosId === undefined || this.sosId === 0 || this.shopCode === "") {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please enter full information',
        detail: '',
      })
    } else {
      this.actionDialog = true;
    }
  }
  resetInputNewInven() {
    this.activeDatesInt = this.listSOSShop.map((item: any) => item.active_date_int);
  }
  confirmAction(event: any) {
    this._service.SOS_Shop_Action(
      Helper.ProjectID(),
      this.shopCode,
      this.sosId,
      this.listMonth?.code,
      parseInt(Pf.StringDateToInt(this.limitedFromDate)),
      this.limitedToDate !== undefined ? parseInt(Pf.StringDateToInt(this.limitedMaxDate)) : parseInt(Pf.StringDateToInt(this.limitedToDate)),
      +this.target!
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.actionDialog = false;

        // clear filter
        this.shopCode = ""
        this.listMonth = null
        this.limitedFromDate = undefined
        this.limitedMaxDate = undefined
        this.listSOS = undefined
        this.sosId = undefined
        this.target = undefined

        this.loadData(1);

        this.messageService.add({
          severity: 'success',
          summary: 'Edit SOS Config successfully',
          detail: '',
        })
      } else {
        this.actionDialog = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }

  openClone() {
    this.cloneDialog = true;
  }  
  confirmClone(event: Event) {
    if (this.listMonthTo === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please select Year Month To',
        detail: '',
      })
    } else {
      this._service.SOS_Shop_Clone(
        Helper.ProjectID(),
        this.listMonth?.code,
        this.listMonthTo?.code
      ).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.cloneDialog = false;
          this.loadData(1);

          this.messageService.add({
            severity: 'success',
            summary: 'Clone Shop SOS successfully',
            detail: '',
          })
        } else {
          this.cloneDialog = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error! An error occurred. Please try again',
            detail: '',
          })
        }
      }
      )
    }
  }

  cols!: Column[];
  exportColumns!: ExportColumn[];
  ngOnInit() {
    this.cols = [
      // { field: 'code', header: 'Code', customExportHeader: 'Product Code' }, 
      { field: 'error_name', header: 'Error Name', customExportHeader: 'Error Name' },
      { field: 'sos_code', header: 'SOS Code' },
      { field: 'shop_code', header: 'Shop Code' },
      { field: 'target', header: 'Target' }

    ];
    this.exportColumns = this.cols.map((col: any) => ({ title: col.header, dataKey: col.field }));

    this.loadSOSs();
    this.loadData(1);
    this.check_permissions();
    this.messages = [
      { severity: 'error', summary: 'Error', detail: 'Error!!!' },
    ];
  }

  // Import Data
  showImport: number = 0;
  showImportDialog() {
    if (this.showImport === 0 && this.listMonth?.code !== undefined && this.limitedFromDate !== undefined && this.limitedToDate !== undefined) {
      this.showImport = 1;
    } else if (this.listMonth?.code !== undefined && this.limitedFromDate === undefined && this.limitedToDate === undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please fill in Start/End Date',
        detail: '',
      })
    } else if (this.listMonth?.code === undefined && this.limitedFromDate !== undefined && this.limitedToDate !== undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please select Year Month',
        detail: '',
      })
    } else if (this.limitedFromDate === undefined && this.listMonth?.code !== undefined && this.limitedToDate !== undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please fill in Start Date',
        detail: '',
      })
    } else if (this.limitedToDate === undefined && this.limitedFromDate !== undefined && this.listMonth?.code !== undefined) {
      this.messageService.add({
        severity: 'warn', 
        summary: 'Please fill in End Date',
        detail: '',
      })
    } else {
      this.showImport = 0;
      this.messageService.add({
        severity: 'warn',
        summary: 'Please select Year Month & fill in Start/End Date',
        detail: '',
      })
    }
  }

  dataError: any;
  dataMessError: any;
  fileTemplate!: any;
  onChangeFile(event: any) {
    this.dataError = undefined;
    this.dataMessError = undefined;
    this.fileTemplate = event.target.files[0];
  }
  @ViewChild('myInput') myInput: any;
  clearFileInput() {
    this.dataError = undefined;
    this.dataMessError = undefined;
    this.myInput.nativeElement.value = null;
    this.fileTemplate = undefined;
  }
  import() {
    if (this.fileTemplate == undefined) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a file',
      });

      return;
    }

    if (Helper.IsNull(this.listMonth) == true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a month',
      });
      return;
    }
    const formDataUpload = new FormData();
    formDataUpload.append('files', this.fileTemplate);

    this._service
      .SOS_Shop_ImportData(formDataUpload, Helper.ProjectID(), this.listMonth?.code,
        parseInt(Pf.StringDateToInt(this.limitedFromDate)), 
        this.limitedToDate !== undefined ? parseInt(Pf.StringDateToInt(this.limitedMaxDate)) : parseInt(Pf.StringDateToInt(this.limitedToDate)),
      )
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          console.log(data);
          if (data.data.result_ewo_type_SOSShop.length > 0) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successful SOS registration',
            });

            this.clearFileInput();
            this.loadData(1)
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error SOS registration',
            });
          }
        } else {
          if (data.data == null) {
            this.dataMessError = data.message;

            this.messageService.add({
              severity: 'warn',
              summary: 'Warning',
              detail: this.dataMessError,
            });
          } else {
            this.dataError = data.data;
          }
        }
      }
    )
  }
  
  // Get Template
  getTemplate () {
    this._service.SOS_Shop_GetTemplate(Helper.ProjectID())
  }

  // Raw Data
  export() {
    if (this.listMonth === null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please select Year Month',
        detail: '',
      })
    } else {
      // console.log(Helper.ProjectID());
      // console.log(this.listMonth?.code);
      // console.log(this.shopCode);

      this._service.SOS_Shop_RawData(
        Helper.ProjectID(),
        this.listMonth?.code,
        this.shopCode
      )
    }
  }

  handleCopy(text: string) {
    let input = document.createElement('input');
    document.body.appendChild(input);
    input.value = text;
    input.select();
    document.execCommand('copy');
    input.remove();

    this.messageService.add({
      severity: 'success',
      summary: 'Copy success'
    })
  }

  FormatFromToDate(value: any): any {
    return Pf.convertToISODate(value);
  }

    // 'xlsx'
    exportExcel() {
      import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.dataError);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'osa_shop');
      });
    }
  
    saveAsExcelFile(buffer: any, fileName: string): void {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }
}
