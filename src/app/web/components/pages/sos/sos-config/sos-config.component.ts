import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { SosService } from '../services/sos.service';
import { Pf } from 'src/app/_helpers/pf';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
  selector: 'app-sos-config',
  templateUrl: './sos-config.component.html',
  styleUrls: ['./sos-config.component.scss']
})
export class SosConfigComponent {

  messages: Message[] | undefined;

  constructor(
    private router: Router,
    private _service: SosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  newConfigSOSDialog: boolean = false;
  editConfigSOSDialog: boolean = false;
  currentDate: any;

  menu_id = 96;
  items_menu: any = [
    { label: 'SOS '},
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

  isLoading_Filter: any = false;
  is_LoadForm: number = 0;
  listSOS: any = []

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

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

  id: any;
  editId: any;

  checkedWidthFlag: boolean = false;
  inputWidth: boolean = false;
  editInputWidth: any;
  checkedWidth(event: any) {
    this.checkedWidthFlag = event.checked;
  }

  checkedWidthTotalFlag: boolean = false;
  inputWidthTotal: boolean = false;
  editInputWidthTotal: any;
  checkedWidthTotal(event: any) {
    this.checkedWidthTotalFlag = event.checked;
  }

  inputUnit: any = null;
  editInputUnit: any;
  showInputUnit: any;
  showEditInputUnit: any;
  chooseMM() {
    this.inputUnit = "mm";
    this.editInputUnit = "mm";
    this.showInputUnit = "mm-Millimeter";
  }
  chooseCM() {
    this.inputUnit = "cm";
    this.editInputUnit = "cm";
    this.showInputUnit = "cm-Centimeter";
  }
  chooseM() {
    this.inputUnit = "m";
    this.editInputUnit = "m";
    this.showInputUnit = "m-Meter";
  }

  inputFoot: boolean = false;
  editInputFood: any;

  inputFacing: boolean = false;
  editInputFacing: any;

  imageResult: any = false;
  editImageResult: any;

  imageByItem: any = false;
  editImageByItem: any;

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

    this._service.Config_SOS_GetList(
      Helper.ProjectID(),
      intDateStart,
      intDateEnd
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.listSOS = data.data;
        this.totalRecords = Helper.IsNull(this.listSOS) != true ? this.listSOS.length : 0
        this.isLoading_Filter = false;
      } else {
        this.listSOS = [];
        this.isLoading_Filter = false;
      }
    })
  }

  openAddForm() {
    this.newConfigSOSDialog = true;
  }
  resetNewConfigSOSDialog() {
    this.newConfigSOSDialog = false;
  }
  saveNewConfigSOS(event: Event) {
    if (this.checkedWidthFlag === true || this.checkedWidthTotalFlag === true) {
      if (this.inputUnit === null && this.activeDateInt === undefined) {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Please complete all information!',
          header: 'Error',
          icon: 'pi pi-exclamation-triangle',
          rejectButtonStyleClass: "p-button-text",
          accept: () => {
            document.getElementById("projectId")?.focus()
            close();
          },
          reject: () => {
            close();
          }
        });
      } else if (this.inputUnit === null) {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Please select Unit!',
          header: 'Error',
          icon: 'pi pi-exclamation-triangle',
          rejectButtonStyleClass: "p-button-text",
          accept: () => {
            document.getElementById("unit")?.focus()
            close();
          },
          reject: () => {
            close();
          }
        });
      } else if (this.activeDateInt === undefined) {
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
        this._service.Config_SOS_Action(
          Helper.ProjectID(),
          this.id = 0,
          this.activeDateInt !== undefined ? parseInt(Pf.StringDateToInt(this.activeDateInt)) : 0,
          this.inputWidth === false ? 0 : 1,
          this.inputWidthTotal === false ? 0 : 1,
          this.inputUnit,
          this.inputFoot === false ? 0 : 1,
          this.inputFacing === false ? 0 : 1,
          this.imageResult === false ? 0 : 1,
          this.imageByItem === false ? 0 : 1,
          "create"
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.newConfigSOSDialog = false;
            this.loadData(1);
  
            // clear value
            this.activeDateInt = "";
            this.inputWidth = false;
            this.inputWidthTotal = false;
            this.inputUnit = "";
            this.inputFoot = false;
            this.inputFacing = false;
            this.imageResult = false;
            this.imageByItem = false;

            this.checkedWidthFlag = false;
            this.checkedWidthTotalFlag = false;
  
            this.messageService.add({
              severity: 'success',
              summary: 'Add new S0S Config successfully',
              detail: '',
            })
          } else {
            this.newConfigSOSDialog = false;
            this.messageService.add({
              severity: 'danger',
              summary: 'Error',
              detail: '',
            });
          }
        })
      }
    } else {
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
        this._service.Config_SOS_Action(
          Helper.ProjectID(),
          this.id = 0,
          this.activeDateInt !== undefined ? parseInt(Pf.StringDateToInt(this.activeDateInt)) : 0,
          this.inputWidth === false ? 0 : 1,
          this.inputWidthTotal === false ? 0 : 1,
          this.inputUnit,
          this.inputFoot === false ? 0 : 1,
          this.inputFacing === false ? 0 : 1,
          this.imageResult === false ? 0 : 1,
          this.imageByItem === false ? 0 : 1,
          "create"
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.newConfigSOSDialog = false;
            this.loadData(1);
  
            // clear value
            this.activeDateInt = "";
            this.inputWidth = false;
            this.inputWidthTotal = false;
            this.inputUnit = "";
            this.inputFoot = false;
            this.inputFacing = false;
            this.imageResult = false;
            this.imageByItem = false;
  
            this.messageService.add({
              severity: 'success',
              summary: 'Add new S0S Config successfully',
              detail: '',
            })
          } else {
            this.newConfigSOSDialog = false;
            this.messageService.add({
              severity: 'danger',
              summary: 'Error',
              detail: '',
            });
          }
        })
      }
    }
    
  }
  resetAllInput() {
    this.activeDatesInt = this.listSOS.map((item: any) => item.active_date_int);

    this.activeDateInt = "";
    this.inputWidth = false;
    this.inputWidthTotal = false;
    this.inputUnit = "";
    this.inputFoot = false;
    this.inputFacing = false;
    this.imageResult = false;
    this.imageByItem = false;
  }

  openEditForm(
    ID: any,
    ActiveDate: any,
    InputWidth: any,
    InputWidthTotal: any,
    Unit: any,
    InputFoot: any,
    InputFacing: any,
    ImageResult: any,
    ImageByItem: any
  ) {
    this.editConfigSOSDialog = true;

    this.editId = ID
    this.editActiveDate = ActiveDate
    this.editInputWidth = InputWidth === 0 ? false : true
    this.editInputWidthTotal = InputWidthTotal === 0 ? false : true
    this.editInputUnit = Unit
    if (Unit === "mm") {
      this.showEditInputUnit = "mm-Millimeter"
    } else if (Unit === "cm") {
      this.showEditInputUnit = "cm-Centimeter"
    } else if (Unit === "m") {
      this.showEditInputUnit = "m-Meter"
    }
    this.editInputFood = InputFoot === 0 ? false : true
    this.editInputFacing = InputFacing === 0 ? false : true
    this.editImageResult = ImageResult === 0 ? false : true
    this.editImageByItem = ImageByItem === 0 ? false : true
  }
  resetEditConfigSOSDialog() {
    this.editConfigSOSDialog = false;
  }
  saveEditConfigSOS() {
    this._service.Config_SOS_Action(
      Helper.ProjectID(),
      this.editId,
      parseInt(Pf.StringDateToInt(this.editActiveDate)),
      this.editInputWidth === false ? 0 : 1,
      this.editInputWidthTotal === false ? 0 : 1,
      this.editInputUnit,
      this.editInputFood === false ? 0 : 1,
      this.editInputFacing === false ? 0 : 1,
      this.editImageResult === false ? 0 : 1,
      this.editImageByItem === false ? 0 : 1,
      "update"
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.editConfigSOSDialog = false;
        this.loadData(1);

        this.messageService.add({
          severity: 'success',
          summary: 'Add new S0S Config successfully',
          detail: '',
        })
      } else {
        this.editConfigSOSDialog = true;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }

  openDelete(    
    ProjectId: any,
    ID: any,
    ActiveDate: any,
    InputWidth: any,
    InputWidthTotal: any,
    Unit: any,
    InputFoot: any,
    InputFacing: any,
    ImageResult: any,
    ImageByItem: any,
    event: Event
  ) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._service.Config_SOS_Action(
          ProjectId,
          ID,
          parseInt(Pf.StringDateToInt(ActiveDate)),
          InputWidth,
          InputWidthTotal,
          Unit,
          InputFoot,
          InputFacing,
          ImageResult,
          ImageByItem,
          "delete"
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.loadData(1);

            this.messageService.add({
              severity: 'success',
              summary: 'Delete SOS Config successfully',
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
    this.loadData(1);

    // this.filterProject = this.filterProjects.find((item: any) => item.Id == Helper.ProjectID()).Name;
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

  GetLanguage(key: string) {
    return Helper.GetLanguage(key);
  }
}
