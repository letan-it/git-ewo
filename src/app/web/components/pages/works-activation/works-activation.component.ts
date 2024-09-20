import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { FileService } from 'src/app/web/service/file.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { SurveyService } from 'src/app/web/service/survey.service';

@Component({
  selector: 'app-works-activation',
  templateUrl: './works-activation.component.html',
  styleUrls: ['./works-activation.component.scss']
})
export class WorksActivationComponent {
  items_menu: any = [
    { label: ' REPORT' }, 
    {
      label: ' Works ACTIVATION',
      icon: 'pi pi-table',
    },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
  menu_id = 110;
  check_permissions() {
    const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
      (item: any) => item.menu_id == this.menu_id && item.check == 1
    );
    if (menu.length > 0) {
    } else {
      this.router.navigate(['/empty']);
    }
  }

  constructor(
    private router: Router,
    private _service: ReportsService,
    private _serviceSurvey: SurveyService,
    private serviceExport: ExportService,
    private edService: EncryptDecryptService,
    private messageService: MessageService,
    private _file: FileService
  ) { }
  is_loadForm: number = 0;
  ListStatus: any = [
    { name: 'Active', code: '1' },
    { name: 'In-Active', code: '0' },
  ];
  is_test: string[] = [];
  display: boolean = false;
  display_model: boolean = false;
  message: string = '';

  dateStart: any | undefined;
  dateEnd: any | undefined;

  shop_code: string = '';
  shop_name: string = '';
  customer_shop_code: string = '';
  uuid: string = '';
  project_shop_code: string = '';
  // msgs: Message[] = [];
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  project_id: any = 0;
  itemsData: any;
  download_survey: any = 0;
  download_display: any = 0;
  download_sellout: any = 0;

  item_Survey: number = 0;
  item_SurveyReport: number = 0;
  selectSurvey(event: any) {
    this.item_Survey = event != null ? event.Id : 0;
  }
  selectSurveyReport(event: any) {
    this.item_SurveyReport = event != null ? event.Id : 0;
  }
  DefaultPPTDownload() {
    this.download_survey = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this.serviceExport.ewo_Report_GetRawData_PPT_bySurvey(
      this.totalRecords,
      1,
      Helper.ProjectID(),
      this.item_SS,
      this.item_reportStatus,
      intDateStart,
      intDateEnd,
      this.shop_code,
      this.customer_shop_code,
      this.project_shop_code,
      this.item_ShopType,
      this.item_Province == null ? 0 : this.item_Province.code,
      this.item_District == null ? 0 : this.item_District.code,
      this.item_Ward == null ? 0 : this.item_Ward.code,
      this.item_channel,
      this.item_ShopRouter,
      -1,
      this.item_ASM,
      this.item_Survey
    );
  }
  DisplayDownload() {
    this.download_display = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    if (this.NofiIsNull(this.item_Display, 'promotion') == 1) {
      return;
    } else {
      this.serviceExport.ewo_ReportDisplay_GetRawData(
        this.totalRecords,
        1,
        Helper.ProjectID(),
        this.item_SS,
        this.item_reportStatus,
        intDateStart,
        intDateEnd,
        this.shop_code,
        this.customer_shop_code,
        this.project_shop_code,
        this.item_ShopType,
        this.item_Province == null ? 0 : this.item_Province.code,
        this.item_District == null ? 0 : this.item_District.code,
        this.item_Ward == null ? 0 : this.item_Ward.code,
        this.item_channel,
        this.item_ShopRouter,
        -1,
        this.item_ASM,
        this.item_Display
      );

      this.item_Display = null;
    }
  }

  SellOutDownload() {
    this.download_sellout = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this.serviceExport.ewo_ReportSellOut_GetRawData(
      this.totalRecords,
      1,
      Helper.ProjectID(),
      this.item_SS,
      this.item_reportStatus,
      intDateStart,
      intDateEnd,
      this.shop_code,
      this.shop_name,
      this.customer_shop_code,
      this.project_shop_code,
      this.item_ShopType,
      this.item_Province == null ? 0 : this.item_Province.code,
      this.item_District == null ? 0 : this.item_District.code,
      this.item_Ward == null ? 0 : this.item_Ward.code,
      this.item_channel,
      this.item_ShopRouter,
      -1,
      this.item_ASM
    );
  }

  DefaultDownload() {
    this.download_survey = 0;
    let is_test = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this.serviceExport.ewo_ReportSurvey_GetRawData(
      this.totalRecords,
      1,
      Helper.ProjectID(),
      this.item_SS,
      this.item_reportStatus,
      intDateStart,
      intDateEnd,
      this.shop_code,
      this.shop_name,
      this.customer_shop_code,
      this.project_shop_code,
      this.item_ShopType,
      this.item_Province == null ? 0 : this.item_Province.code,
      this.item_District == null ? 0 : this.item_District.code,
      this.item_Ward == null ? 0 : this.item_Ward.code,
      this.item_channel,
      this.item_ShopRouter,
      -1,
      this.item_ASM,
      this.item_Survey
    );
  }
  DownloadModelSamSung() {
    this.download_survey = 0;
    let is_test = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this.serviceExport.ewo_ReportSurvey_GetRawData_model(
      this.totalRecords,
      1,
      Helper.ProjectID(),
      this.item_SS,
      this.item_reportStatus,
      intDateStart,
      intDateEnd,
      this.shop_code,
      this.customer_shop_code,
      this.project_shop_code,
      this.item_ShopType,
      this.item_Province == null ? 0 : this.item_Province.code,
      this.item_District == null ? 0 : this.item_District.code,
      this.item_Ward == null ? 0 : this.item_Ward.code,
      this.item_channel,
      this.item_ShopRouter,
      -1,
      this.item_ASM,
      72
    );
  }
  fileTemplete: any = undefined;
  upload_model(event: any) {
    this.fileTemplete = event.target.files[0];
  }
  import_model() {
    const formDataUpload = new FormData();

    formDataUpload.append('files', this.fileTemplete);
    this._serviceSurvey
      .ewo_Model_SurveyData_Fixture_Import(formDataUpload)
      .subscribe((data: any) => {
        this.clearFileInput();
        if (data.result == EnumStatus.ok) {
          this.NofiResult(
            'Page Works',
            'Import Model Edit',
            'Import successful model edit',
            'success',
            'Successfull'
          );
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: data.message,
          });
        }
      });
  }

  @ViewChild('myInputFile') myInputFile: any;
  clearFileInput() {
    this.myInputFile.nativeElement.value = null;
    this.fileTemplete = undefined;
  }

  item_Display: any;
  selectPromotion(event: any) {
    this.item_Display = event != null ? event.code : null;
  }
  selectMonth: any;
  products: any;
  project:any 
  projectName () {
      let _u = localStorage.getItem(EnumLocalStorage.user);
      this.project = JSON.parse(
          this.edService.decryptUsingAES256(_u)
      ).projects.filter(
          (d: any) => d.project_id == Helper.ProjectID()
      )[0];
      console.log(this.project);
  }
  ngOnInit() {
    this.products = Array.from({ length: 20 }).map((_, i) => `Item #${i}`);
    this.loadUser();
    this.projectName ();
    this.check_permissions();

    this.project_id = Helper.ProjectID();
    // this.showFiter = 0;
    let newDate = new Date();
    this.dateEnd = this.getFormatedDate(newDate, 'YYYY-MM-dd');

    var dateObj = new Date();
    var month = dateObj.getUTCMonth(); //months from 1-12
    var year = dateObj.getUTCFullYear();
    newDate = new Date(year, month, 1);
    this.dateStart = this.getFormatedDate(newDate, 'YYYY-MM-dd');

    this.itemsData = [
      {
        label: 'Raw data SOS',
        icon: 'pi pi-file-excel',
        command: () => {
          this.export();
        },
      },
      { separator: true },
      // {
      //   label: 'Raw data SURVEY',
      //   icon: 'pi pi-file-excel',
      //   command: () => {
      //     this.download_survey = 1;
      //     this.download_display = 0;
      //     this.download_sellout = 0
      //   },
      // },
      /*
{ separator: true },
{
  label: 'Raw data DISPLAY',
  icon: 'pi pi-file-excel',
  command: () => {
    this.download_display = 1;
    this.download_survey = 0;
    this.download_sellout = 0
  },
},
{ separator: true },
{
  label: 'Raw data SELLOUT',
  icon: 'pi pi-file-excel',
  command: () => {
    this.download_display = 0;
    this.download_survey = 0;
    this.download_sellout = 1;
  },
},
*/
    ];
    if (
      Helper.ProjectID() == 4 ||
      Helper.ProjectID() == 41 ||
      Helper.ProjectID() == 42
    ) {
      this.itemsData.push(
        { separator: true },
        // {
        //     label: 'Raw data pdf',
        //     icon: 'pi pi-file-pdf',
        //     command: () => {

        //         this.exportPDF();
        //     },
        // },
        // { separator: true },
        {
          label: 'File Power Point (pptx)',
          icon: 'pi pi-file',
          command: () => {
            this.download_survey = 2;
            // this.exportPP();
          },
        }
      );
    }

    // this.filter(1);
  }
  ListReport: any = [];
  isLoading_Filter: any = false;

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this._pageNumber = (this.first + this.rows) / this.rows;

    this.filter(this._pageNumber);
  }

  filter(pageNumber: number) {
    this.is_loadForm = 1;
    if (pageNumber == 1) {
      this.first = 0;
      this.totalRecords = 0;
      // this.rows  = 20;
      this._pageNumber = 1;
    }

    if (Helper.IsNull(this.dateStart) == true) {
      this.NofiIsNull(this.dateStart, 'date start');
      return;
    }

    if (Helper.IsNull(this.dateEnd) == true) {
      this.NofiIsNull(this.dateEnd, 'date end');
      return;
    }

    // this.is_test.length == 0 ? 0 : 1,

    this.ListReport = [];
    this.isLoading_Filter = true;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this._service
      .ewo_ReportGetList_ACTIVATION(
        this.rows,
        pageNumber,
        Helper.ProjectID(),
        this.item_SS,
        this.item_reportStatus,
        intDateStart,
        intDateEnd,

        this.shop_code,
        this.customer_shop_code,
        this.project_shop_code,
        this.item_ShopType,
        this.item_Province == null ? 0 : this.item_Province.code,
        this.item_District == null ? 0 : this.item_District.code,
        this.item_Ward == null ? 0 : this.item_Ward.code,
        this.item_channel,
        this.item_ShopRouter,
        -1,
        this.item_ASM,
        this.uuid
      )
      .subscribe((data: any) => {
        this.is_loadForm = 0;
        if (data.result == EnumStatus.ok) {
          if (data.data.length > 0) {
            this.ListReport = data.data;
            this.totalRecords = this.ListReport[0].TotalRows;
            this.ListReport.forEach((element: any) => {
              try {
                element.audio = JSON.parse(element.audio);
              } catch (error) { }
            });
            this.isLoading_Filter = false;
          } else {
            this.isLoading_Filter = false;
            this.message = 'No data';
            this.display = true;
          }
        }
      });
  }

  OK(model: any) {
    // this.ShopEdit = false;
    if (model == 'display') {
      this.display = false;
    } else if (model == 'display_model') {
      this.display_model = true;
    }
  }

  showFiter: number = 1;
  ShowHideFiter() {
    if (this.showFiter == 1) {
      this.showFiter = 0;
    } else {
      this.showFiter = 1;
    }
  }

  selectStatus: any;

  customer_code: string = '';
  customer_name: string = '';

  item_ShopType: number = 0;
  selectShopType(event: any) {
    this.item_ShopType = event != null ? event.code : 0;
  }
  item_ShopRouter: number = 0;
  selectShopRouter(event: any) {
    this.item_ShopRouter = event != null ? event.code : 0;
  }
  item_channel: number = 0;
  selectedChannel(event: any) {
    this.item_channel = event != null ? event.code : 0;
  }
  item_ASM: number = 0;
  selectASM(event: any) {
    this.item_ASM = event != null ? event.code : 0;
  }
  item_SS: number = 0;
  selectSS(event: any) {
    this.item_SS = event != null ? event.code : 0;
  }
  item_reportStatus: number = 0;
  selectReportStatus(event: any) {
    this.item_reportStatus = event != null ? event.code : 0;
  }

  item_Province: any;
  selectProvince(event: any) {
    this.item_Province = event != null ? event : 0;
  }
  item_District: any;
  selectDistrict(event: any) {
    this.item_District = event != null ? event : 0;
  }
  item_Ward: any;
  selectWard(event: any) {
    this.item_Ward = event != null ? event : 0;
  }

  getStatusReport(status: string) {
    switch (status.toLocaleLowerCase()) {
      case 'thành công':
        return 'success';
      case 'không thành công':
        return 'danger';
    }
    return '';
  }

  export() {
    let is_test = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this.serviceExport.ewo_Report_GetRawData_SOS(
      this.totalRecords,
      1,
      Helper.ProjectID(),
      this.item_SS,
      this.item_reportStatus,
      intDateStart,
      intDateEnd,
      this.shop_code,
      this.customer_shop_code,
      this.project_shop_code,
      this.item_ShopType,
      this.item_Province == null ? 0 : this.item_Province.code,
      this.item_District == null ? 0 : this.item_District.code,
      this.item_Ward == null ? 0 : this.item_Ward.code,
      this.item_channel,
      this.item_ShopRouter,
      -1,
      this.item_ASM
    );
  }
  exportPDF() {
    let is_test = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this.serviceExport.ewo_Report_GetRawData_PDF(
      this.totalRecords,
      1,
      Helper.ProjectID(),
      this.item_SS,
      this.item_reportStatus,
      intDateStart,
      intDateEnd,
      this.shop_code,
      this.customer_shop_code,
      this.project_shop_code,
      this.item_ShopType,
      this.item_Province == null ? 0 : this.item_Province.code,
      this.item_District == null ? 0 : this.item_District.code,
      this.item_Ward == null ? 0 : this.item_Ward.code,
      this.item_channel,
      this.item_ShopRouter,
      -1,
      this.item_ASM
    );
  }
  exportPP() {
    let is_test = 0;

    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

    this.serviceExport.ewo_Report_GetRawData_PPT(
      this.totalRecords,
      1,
      Helper.ProjectID(),
      this.item_SS,
      this.item_reportStatus,
      intDateStart,
      intDateEnd,
      this.shop_code,
      this.customer_shop_code,
      this.project_shop_code,
      this.item_ShopType,
      this.item_Province == null ? 0 : this.item_Province.code,
      this.item_District == null ? 0 : this.item_District.code,
      this.item_Ward == null ? 0 : this.item_Ward.code,
      this.item_channel,
      this.item_ShopRouter,
      -1,
      this.item_ASM
    );
  }
  @ViewChild('myInputFileUrl') myInputFileUrl: any;
  clearFileInputUrl() {
    this.myInputFileUrl.nativeElement.value = null;
    this.fileUrl = undefined;
  }

  fileUrl: any = undefined;
  linkUrl: any = '';
  typeFile: any = '';

  upload_file_url(event: any) {
    this.linkUrl = '';
    this.fileUrl = event.target.files[0];

    this.currentUser.projects = this.currentUser.projects.filter(
      (data: any) => data.project_id == Helper.ProjectID()
    );
    const formDataUpload = new FormData();
    formDataUpload.append('files', this.fileUrl);
    formDataUpload.append(
      'ImageType',
      this.currentUser.projects[0].project_code
    );

    // this._file.UploadFile(formDataUpload).subscribe((data: any) => {
    //   if (data.result == EnumStatus.ok) {
    //     this.clearFileInputUrl();
    //     this.linkUrl = EnumSystem.fileLocal + data.data;

    //     const url = this.linkUrl;
    //     const fileType = url.split('.');
    //     this.typeFile = fileType[fileType.length - 1];
    //   }
    // });

    const fileName = AppComponent.generateGuid();
        const newFile = new File([this.fileUrl], fileName+this.fileUrl.name.substring(this.fileUrl.name.lastIndexOf('.')),{type: this.fileUrl.type});
        const modun = 'IMAGE-FILE';
        const drawText = this.currentUser.projects[0].project_code;
        this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
            (response : any) => {     

                this.clearFileInputUrl();
                this.linkUrl = response.url;  

                const url = this.linkUrl;
                const fileType = url.split('.');
                this.typeFile = fileType[fileType.length - 1];

            },
            (error : any) => { 
               
            }
        );

  }

  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  /* To copy any Text */

  copyText(val: string) {
    if (this.NofiIsNull(this.linkUrl, 'file') == 1) {
      return;
    } else {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
    }
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
