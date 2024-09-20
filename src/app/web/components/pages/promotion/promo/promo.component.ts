import { Component, OnInit, ViewChild } from '@angular/core';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Message, MessageService } from 'primeng/api';
import { Pf } from 'src/app/_helpers/pf';
import { ExportService } from 'src/app/web/service/export.service';
import { AppComponent } from 'src/app/app.component';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';


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
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.scss']
})
export class PromoComponent implements OnInit {


  constructor(private _service: PromotionService,
    private messageService: MessageService,
    private router: Router,
    private edService: EncryptDecryptService
  ) { }

  items_menu: any = [
    { label: ' SETTING KPI' },
    { label: ' Display ', icon: 'pi pi-gift', routerLink: '/promo' },
    { label: ' Promotion', icon: 'pi pi-question-circle' },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
  icon_eye = "pi pi-eye"


  menu_id = 23;
  check_permissions() {
    const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
      (item: any) => item.menu_id == this.menu_id && item.check == 1
    );
    if (menu.length > 0) {
    } else {
      this.router.navigate(['/empty']);
    }
  }

  promotion_Code: any = ''
  promotion_group: any = ''
  promotion_name: any = ''
  survey: any = -1
  status: any = -1
  product: any = -1






  messages!: Message[];
  showFiter: boolean = true
  item_Product: any = 0;
  itemProduct: any = null;
  dataOnePromotion!: any
  dataPromotion: any[] = []
  PromotionCreate: boolean = false
  // clone
  ShowClone: boolean = false
  selectPromotion: any
  listPromotion: any = []
  promotion_clone_name!: string
  promotion_clone_code!: string
  allPromotionCode!: any



  statuses: any = [
    {
      title: "Active",
      value: 1
    }, {
      title: "In Active",
      value: 0
    },
  ]


  cols!: Column[];
  exportColumns!: ExportColumn[];
  ngOnInit(): void {
    // this.getDataPromotion()
    this.cols = [
      // { field: 'code', header: 'Code', customExportHeader: 'Product Code' }, 
      { field: 'error_name', header: 'Error Name', customExportHeader: 'Error Name' },
      { field: 'promotion_code', header: 'Promotion Code' },
      { field: 'promotion_group', header: 'Promotion Group' },
      { field: 'promotion_name', header: 'Promotion Name' },
      { field: 'desc_image', header: 'Image' },
      { field: 'status', header: 'Status' }

    ];
    this.exportColumns = this.cols.map((col: any) => ({ title: col.header, dataKey: col.field }));
    this.getListPromotion()
    // listPromotion


  }


  currentUser: any
  user_profile: any
  userProfile: any
  loadUser() {
    if (this.user_profile == EnumSystem.current) {
      let _u = localStorage.getItem(EnumLocalStorage.user);

      this.currentUser = JSON.parse(
        this.edService.decryptUsingAES256(_u)
      );
      this.currentUser.employee[0]._status =
        this.currentUser.employee[0].status == 1 ? true : false;
      this.userProfile = this.currentUser.employee[0];

      console.log("🚀 ~ this.userProfile:", this.userProfile)

    }
  }


  getListPromotion() {
    this._service.Promotion_GetList(Helper.ProjectID(), '', '', '', -1, -1, -1, 100000, this.numberPage).subscribe((res: any) => {
      if (res.result == EnumStatus.ok) {

        const data = res.data.map((e: any) => ({
          name: e.promotion_code + '-' + e.promotion_name,
          value: e.promotion_id,
          code: e.promotion_code,
          TotalRows: e.TotalRows
        }))
        this.listPromotion = data
        this.totalRecords = this.listPromotion.length > 0 ? this.listPromotion[0].TotalRows : 0
      }
    })
  }
  _pageNumber: number = 1;

  getDataPromotion(pageNumber: number) {

    if (pageNumber == 1) {
      this.first = 0;
      this.totalRecords = 0;
      this._pageNumber = 1;
    }

    this._service.Promotion_GetList(Helper.ProjectID(),
      this.promotion_Code, this.promotion_group,
      this.promotion_name, this.survey, this.status,
      this.product, this.rows, this._pageNumber).subscribe((res: any) => {
        if (res.result === EnumStatus.ok) {
          this.dataPromotion = res.data
          this.totalRecords = this.dataPromotion.length > 0 ? this.dataPromotion[0].TotalRows : 0
        }
      })
  }

  selectStatus(e: any) {
    this.status = e.value === null ? -1 : e.value
  }

  selectSurvey(e: any) {
    this.survey = e.value === null ? -1 : e.value

  }


  selectProduct(e: any) {
    this.product = e.value === null ? -1 : e.value

  }

  handleFilter() {
    this.getDataPromotion(1)
  }


  showFilter() {
    this.showFiter = !this.showFiter
  }

  create() {
    this.PromotionCreate = true,
      this.dataOnePromotion = undefined
  }


  export() {
    this._service.Promotion_RawData(
      Helper.ProjectID(),
      this.promotion_Code,
      this.promotion_group,
      this.promotion_name,
      this.survey,
      this.status, this.product)
  }


  first: number = 0;
  rows: number = 20;
  numberPage: number = 1
  totalRecords: number = 0
  onPageChange(e: any) {

    this.first = e.first
    this.rows = e.rows
    this._pageNumber = (this.first + this.rows) / this.rows
    this.getDataPromotion(this._pageNumber)
  }

  update(e: any) {
    this.PromotionCreate = true
    this.dataOnePromotion = this.dataPromotion.filter((i: any) => i.promotion_id == e.promotion_id)

  }

  // clone
  clone() {
    this.ShowClone = !this.ShowClone
  }


  handlerClone() {

    if (Helper.IsNull(this.promotion_clone_code) == true) {
      this.messageService.add({
        severity: EnumStatus.warning,
        summary: EnumSystem.Notification,
        detail: 'Please enter a promotion code',
      });
      return;
    }
    if (Pf.checkLengthCode(this.promotion_clone_code) != true) {
      this.messageService.add({
        severity: EnumStatus.warning,
        summary: EnumSystem.Notification,
        detail: 'Character length of promotion code must be greater than or equal to 8',
      });
      return;
    }
    if (Pf.checkSpaceCode(this.promotion_clone_code) == true) {
      this.messageService.add({
        severity: EnumStatus.warning,
        summary: EnumSystem.Notification,
        detail: 'Promotion code must not contain empty characters',
      });
      return;
    }
    if (Pf.checkUnsignedCode(this.promotion_clone_code) == true) {
      this.messageService.add({
        severity: EnumStatus.warning,
        summary: EnumSystem.Notification,
        detail: 'Promotion code is not allowed to enter accented characters',
      });
      return;
    }
    if (Pf.CheckAccentedCharacters(this.promotion_clone_code) == true) {
      this.messageService.add({
        severity: EnumStatus.warning,
        summary: EnumSystem.Notification,
        detail: 'Promotion code is not allowed to enter accented characters',
      });
      return;
    }

    if (this.NofiIsNull(this.selectPromotion, 'Promotion') == 1) return
    if (this.NofiIsNull(this.promotion_clone_code, 'Promotion clone code') == 1) return
    // if (this.checkSpaceAndCharacter(this.promotion_clone_code, 'Promotion clone code'))
    if (this.NofiIsNull(this.promotion_clone_name, 'Promotion clone name') == 1) return
    const checkCode = this.listPromotion.some((i: any) => (i.code == this.promotion_clone_code))

    if (checkCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Promotion code already exists ',
      })
    } else {
      this._service.Promotion_Clone(
        Helper.ProjectID(),
        this.selectPromotion?.value,
        this.promotion_clone_code,
        this.promotion_clone_name).subscribe((res: any) => {

          if (res.result == EnumStatus.ok) {
            this.NofiResult('Page Promotion', 'Add Promotion clone', `Add Promotion clone ${this.promotion_clone_code}-${this.promotion_clone_name} Successfull`, 'success', 'Successfull');
            this.ShowClone = false
            this.getListPromotion()
            this.clear()
            this.handleFilter()
          }
        })
    }

  }


  clear() {
    this.selectPromotion = undefined
    this.promotion_clone_code = '',
      this.promotion_clone_name = ''
  }

  actionHiddenShow(e: any) {
    this.PromotionCreate = false
    this.handleFilter()
  }

  checkSpaceAndCharacter(value: any, name: string) {
    let check = 0
    if (Pf.CheckAccentedCharacters(value) || Pf.checkSpace(value)) {

    }
    return check
  }

  typeImport: number = 0;
  showTemplate: number = 0;
  ShowHideTemplate(value: any) {
    if (this.showTemplate == 0) {
      this.showTemplate = 1;
      this.typeImport = value;
      this.clearDataImport();
    } else {
      this.showTemplate = 0;
    }
  }

  file!: any;
  // On file Select
  onChange(event: any) {
    this.clearDataImport();
    this.file = event.target.files[0];
  }

  @ViewChild('myInputFile') myInputFile: any;
  clearFileInput() {
    this.myInputFile.nativeElement.value = null;
    this.file = undefined;
  }
  dataError: any;
  dataMessError: any;
  clearDataImport() {
    this.dataError = undefined;
    this.dataMessError = undefined;
  }

  getTemplate() {
    this._service.Promotion_GetTemplate(Helper.ProjectID());
  }
  importTemplate() {
    if (Helper.IsNull(this.file) == true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter file'
      })
      return;
    } else {
      this.clearDataImport();
      const formDataUpload = new FormData();
      formDataUpload.append('files', this.file);

      this._service.Promotion_ImportData(formDataUpload, Helper.ProjectID())
        .subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.NofiResult('Page Promotion', 'Add Promotion', 'Add Promotion Successfull', 'success', 'Successfull');
            this.handleFilter()
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
          this.clearFileInput();

        })
    }
  }
  // 'jspdf' - 'jspdf-autotable'
  exportPdf(title: any, value: any) {
    import(title).then((jsPDF) => {
      import(value).then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.dataError);
        doc.save('products.pdf');
      });
    });
  }

  // 'xlsx'
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataError);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'promotion');
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

  readData(event: any) {
    console.log("🚀 ~ file: promo.component.ts:428 ~ PromoComponent ~ readData ~ event:", event)
    if (event == true) {
      this.getDataPromotion(1)
    }
  }

  // notification
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
