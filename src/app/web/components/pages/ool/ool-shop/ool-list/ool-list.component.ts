import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { MastersService } from 'src/app/web/service/masters.service';
import { OolService } from 'src/app/web/service/ool.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-ool-list',
  templateUrl: './ool-list.component.html',
  styleUrls: ['./ool-list.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class OolListComponent {
  constructor(
    private _service: OolService,
    private masters: MastersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private edService: EncryptDecryptService,
    private router: Router) { }

  items_menu: any = [
    { label: ' SETTING KPI' },
    { label: ' OOL ', icon: 'pi pi-table', routerLink: '/ool-shop' },
    { label: ' Config', icon: 'pi pi-wrench' },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

  export() {
    this._service.OOL_List_RawData(Helper.ProjectID());
  }

  oolListDialog: boolean = false;
  ool!: any;
  submitted: boolean = false;

  representatives: any = [];
  ngOnInit() {

    this.loadUser();
    this.loadData(1);
    this.getTargetType();

  }


  first: number = 0;
  rows: number = 20;
  // numberPage: number = 1
  totalRecords: number = 0
  _pageNumber: any = 0

  onPageChange(e: any) {
    this.first = e.first
    this.rows = e.rows
    this._pageNumber = (this.first + this.rows) / this.rows
    this.loadData(this._pageNumber)
  }

  loading: boolean = false;
  listOOLList: any = []
  loadData(pageNumber: number) {

    if (pageNumber == 1) {
      this.first = 1
      this.totalRecords = 0
      this._pageNumber = 1
    }

    this.loading = true;
    this._service.OOL_List_GetList(Helper.ProjectID()).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {

        this.listOOLList = data.data
        this.listOOLList = this.listOOLList.map((x: any) => ({
          ...x,
          _status: (x.status == 1) ? true : false,
          _is_comment: (x.is_comment == 1) ? true : false,
          _ool_type: `[${x.ool_type}] - ${x.NameVN}`,
          representative: {
            name: `[${x.ool_type}] - ${x.NameVN}`
          },
          _toolTipCreate: (Helper.IsNull(x.created_by) != true) ? `Create By : [${x.created_by}] - ${x.created_code} - ${x.created_name} | Create Date : ${x.created_date}` : ``,
          _toolTipUpdate: (Helper.IsNull(x.update_by) != true) ? `Update By : [${x.update_by}] - ${x.update_code} - ${x.update_name} | Update Date : ${x.update_date}` : ``
        }))

        /*
        created_by  created_code  created_date  created_name  
        update_by  update_code   update_date  update_name  
        */

        // <th>{{item.system_code}} </th>
        // <th>{{item.configuration}} </th>
        // <th>{{item.description}} </th>

        const sortType = [] as any
        this.listOOLList.forEach((element: any) => {
          const type = { id: element.ool_type, name: `[${element.ool_type}] - ${element.NameVN}` }
          element._item_ool_type = type

          sortType.push({
            name: `[${element.ool_type}] - ${element.NameVN}`
          })
          const _temp = this.getDistinctObjects(sortType, 'name');
          this.representatives = _temp
        });

        this.totalRecords = this.listOOLList.length > 0 ? this.listOOLList[0].TotalRows : 0
        this.loading = false;

      } else {
        this.listOOLList = []
        this.loading = false;
      }
      console.log('ool list', this.listOOLList)
    })
  }

  getDistinctObjects(dataList: any, property: any) {
    const uniqueValues = new Set();
    return dataList.filter((obj: any) => {
      const value = obj[property];
      if (!uniqueValues.has(value)) {
        uniqueValues.add(value);
        return true;
      }
      return false;
    });
  }


  item_ool: any = null
  selectOOLList(event: any) {

    this.item_ool = ''
    if (Helper.IsNull(event) != true) {
      event.forEach((element: any) => {
        this.item_ool += (element != null) ? (element.id + ' ') : ''
      });
    } else {
      this.item_ool = ''
    }
  }

  clearSelectOOLList(event: any) {
    this.item_ool = (event == true) ? null : this.item_ool
  }

  oolType: any = null
  itemOolType: any = null
  selectTargetType(event: any) {
    this.oolType = (Helper.IsNull(event) != true) ? event.value : null;
  }

  oolTypeList: any = []
  getTargetType() {
    this.masters.ewo_GetMaster(Helper.ProjectID())
      .subscribe((data: any) => {
        this.oolTypeList = []
        if (data.result == EnumStatus.ok) {
          const result = data.data.filter((x: any) => x.Status == 1 && x.ListCode == 'ool_type' && x.Table == 'OOL_List')
          result.forEach((element: any) => {
            this.oolTypeList.push({
              id: element.Id,
              name: `[${element.Id}] - ${element.NameVN}`
            })
          });
        }
      })
  }


  displayOOLItem: boolean = false;
  onDisplay() {
    this.displayOOLItem == false ? true : false;
  }


  openNew() {
    this.oolType = null
    this.itemAction = 'create'
    this.ool = {};
    // this.ool.configuration = {};
    // this.ool.description = null;
    this.submitted = false;
    this.oolListDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  itemAction: any = 'create'
  editOOL(ool: any) {
    this.itemAction = 'update'
    // ool.configuration = (Helper.IsNull(ool.configuration) != true) ? ool.configuration : []
    // ool.description = (Helper.IsNull(ool.description) != true) ? ool.description : undefined
    this.ool = { ...ool };
    this.oolListDialog = true;
  }
  description_1!: any

  user_profile: any;
  currentUser: any;
  userProfile: any;

  loadUser() {
    let _u = localStorage.getItem(EnumLocalStorage.user);
    this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
    this.userProfile = this.currentUser.employee[0];
  }

  checkUser(): any {
    return (this.userProfile.employee_type_id == 1 || 
      this.userProfile.employee_type_id == 2 ||
      this.userProfile.employee_type_id == 3 
    ) ? true : false
  }

  checkConfig(): any {
    return (this.userProfile.employee_type_id == 1  
    ) ? true : false
  }


  someObject(item: any) {
    try {
      return Helper.IsNull(item) != true ? JSON.parse(item) : {};
    } catch (e) {
      return item;
    }
  }

  checksomeObject(item: any) {
    try {
      let t = (Helper.IsNull(item) != true) ? JSON.parse(item) : {};
      return 0;
    } catch (e) {
      return 1;
    }
  }

  showDescription: boolean = false
  showDescript() {
    this.showDescription = !this.showDescription
  }


  deleteOOL(ool: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteActionOOL(ool);
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

  deleteActionOOL(ool: any) {

    this._service.OOL_List_Action(Helper.ProjectID(), ool.ool_id,
      ool.ool_type, ool.ool_name, ool.ool_code, ool.system_code, ool.configuration, ool.description,
      ool.min_image, ool.max_image, ool.order, ool.status, ool.is_comment, 'delete')
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.NofiResult(`Page OOL List`, `Delete area`, `Delete area success`, `success`, `SuccessFull`)
          this.clearAction()
        } else {
          this.NofiResult(`Page OOL List`, `Delete area`, `Delete area error`, `error`, `Error`)
          this.clearAction()
        }
      })
  }

  hideDialog() {
    this.oolListDialog = false;
    this.submitted = false;
  }

  saveOOLList() {
    this.submitted = true;

    if (this.NofiIsNull(this.ool._item_ool_type, 'type') == 1 ||
      this.NofiIsNull(this.ool.ool_code, 'code') == 1 ||
      this.checkLengthCode(this.ool.ool_code, `Character length of code must be greater than or equal to 8`) == 1 ||
      this.checkSpaceCode(this.ool.ool_code, `Code must not contain empty characters`) == 1 ||
      this.checkUnsignedCode(this.ool.ool_code, `Code is not allowed to enter accented characters`) == 1 ||
      this.CheckAccentedCharacters(this.ool.ool_code, `Code is not allowed to enter accented characters`) == 1 ||
      (this.itemAction == 'create' && this.duplicateCode(this.ool.ool_code, 'Code already exists') == 1) ||
      this.NofiIsNull(this.ool.ool_name, 'name') == 1 ||
      (Helper.IsNull(this.ool.configuration) != true && this.NofiErrorConfig(this.ool.configuration, 'JSON format error config') == 1) ||
      (Helper.IsNull(this.ool.min_image) != true && this.checkValue(this.ool.min_image, 'Min Image') == 1) ||
      (Helper.IsNull(this.ool.max_image) != true && this.checkValue(this.ool.max_image, 'Max Image') == 1) ||
      this.checkMinMax(this.ool.min_image, this.ool.max_image, 'Min image must be less than max image') == 1 ||
      (Helper.IsNull(this.ool.order) != true && this.checkValue(this.ool.order, 'order') == 1)) {
      return
    } else {
      this._service.OOL_List_Action(Helper.ProjectID(), (this.itemAction == 'create') ? 0 : this.ool.ool_id,
        this.ool._item_ool_type.id, this.ool.ool_name, this.ool.ool_code,
        this.ool.system_code, Helper.IsNull(this.ool.configuration) != true ? this.ool.configuration : null,
        this.ool.description,
        this.ool.min_image, this.ool.max_image, this.ool.order, (this.ool._status == true) ? 1 : 0, (this.ool._is_comment == true) ? 1 : 0, this.itemAction)
        .subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.NofiResult(`Page OOL List`, (this.itemAction == `create`) ? `Add area` : `Edit area`,
              (this.itemAction == `create`) ? `Add area success` : `Edit area success`, `success`, `SuccessFull`)
            this.clearAction()
          } else {
            this.NofiResult(`Page OOL List`, (this.itemAction == `create`) ? `Add area` : `Edit area`,
              (this.itemAction == `create`) ? `Add area error` : `Edit area error`, `error`, `Error`)
            this.clearAction()
          }
        })
    }

  }

  clearAction() {
    this.oolListDialog = false;
    this.ool = {};
    this.loadData(1)
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    translate: 'no',
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    sanitize: false,
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],

  };

  getSeverity(status: string): any {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
  }

  checkValue(value: any, name: any): any {
    let check = 0;
    if (value < 0 || (value != 0 && Helper.IsNull(value) == true)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `Please enter ${name} larger or equal to 0`,
      });
      check = 1;
    }
    return check;
  }

  checkMinMax(min: any, max: any, name: any): any {
    let check = 0;
    if (min > max && (Helper.IsNull(min) != true || min == 0) && (Helper.IsNull(max) != true || max == 0)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name,
      });
      check = 1;
    }
    return check;
  }
  // Code already exists
  duplicateCode(value: any, name: any) {
    let check = 0;
    // || Pf.checkSpace(value) == true
    if (Helper.IsNull(this.listOOLList) != true && Helper.IsNull(value) != true) {
      this.listOOLList.forEach((element: any) => {
        if (element.ool_code == value) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: name,
          });
          check = 1;
        }
      });
    }
    return check;
  }
  checkLengthCode(value: any, name: any): any {
    let check = 0;
    if (Pf.checkLengthCode(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name,
      });
      check = 1;
    }
    return check;
  }

  checkSpaceCode(value: any, name: any): any {
    let check = 0;
    if (Pf.checkSpaceCode(value) == true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name,
      });
      check = 1;
    }
    return check;
  }
  checkUnsignedCode(value: any, name: any): any {
    let check = 0;
    if (Pf.checkUnsignedCode(value) == true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name,
      });
      check = 1;
    }
    return check;
  }


  CheckAccentedCharacters(value: any, name: any): any {
    let check = 0;
    if (Pf.CheckAccentedCharacters(value) == true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name,
      });
      check = 1;
    }
    return check;
  }


  NofiIsNull(value: any, name: any): any {
    let check = 0;
    if (value == 0) {
      value += '';
    }
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

  NofiErrorConfig(value: any, name: any): any {
    let check = 0;
    // *ngIf="checksomeObject(config_item.configuration) == 0"
    if (this.checksomeObject(value) == 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name,
      });
      check = 1;
    }
    return check;
  }

  NofiImage(value: any, name: any): any {
    let check = 0;
    if (value != 'png' && value != 'jpg' && value != 'jpeg') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
      });
      check = 1;
    }
    return check;
  }


  checkNumber(value: any, name: any): any {
    let check = 0;
    if (Helper.number(value) != true && Helper.IsNull(value) != true) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name + ' wrong format',
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
