import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { MastersService } from 'src/app/web/service/masters.service';
import { OolService } from 'src/app/web/service/ool.service';

@Component({
  selector: 'app-ool-item',
  templateUrl: './ool-item.component.html',
  styleUrls: ['./ool-item.component.scss']
})
export class OolItemComponent {

  constructor(
    private _service: OolService,
    private masters: MastersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private edService: EncryptDecryptService,
    private router: Router) { }


  @Input() inValue: any;
  @Input() action: any = 'view';


  displayOOLItemAnswer: boolean = false;
  onDisplay() {
    this.displayOOLItemAnswer == false ? true : false;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.  
    this.loadData(1);

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
  listOOLItem: any = []
  loadData(pageNumber: number) {
    this.loadMaster();

    if (pageNumber == 1) {
      this.first = 1
      this.totalRecords = 0
      this._pageNumber = 1
    }

    this.loading = true;
    this._service.OOL_item_GetList(Helper.ProjectID(), this.inValue.ool_id).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.listOOLItem = data.data
        this.listOOLItem = this.listOOLItem.map((x: any) => ({
          ...x,
          _status: (x.status == 1) ? true : false,
          _is_allow: (x.is_allow == 1) ? true : false,
          question_master: (Helper.IsNull(this.listItemMaster) != true) ? this.listItemMaster.filter((element: any) => element.question_type == x.question_type &&
            element.support_data == x.support_data && element.typeOf == x.typeOf)[0] : [],
          _toolTipCreate: (Helper.IsNull(x.created_by) != true) ? `Create By : [${x.created_by}] - ${x.created_code} - ${x.created_name} | Create Date : ${x.created_date}` : ``,
          _toolTipUpdate: (Helper.IsNull(x.update_by) != true) ? `Update By : [${x.update_by}] - ${x.update_code} - ${x.update_name} | Update Date : ${x.update_date}` : ``

        }))
        this.totalRecords = this.listOOLItem.length > 0 ? this.listOOLItem[0].TotalRows : 0
        this.loading = false;

      } else {
        this.listOOLItem = []
        this.loading = false;
      }

      console.log('this.listOOLItem : ', this.listOOLItem)

    })
  }

  listItemMaster: any = []
  loadMaster() {
    this._service.OOL_item_Master(Helper.ProjectID())
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          if (data.data.length > 0) {
            this.listItemMaster = []
            data.data.forEach((element: any) => {
              this.listItemMaster.push({
                name: element.name,
                question_type: element.question_type,
                support_data: element.support_data,
                typeOf: element.typeOf
              })
            });
          }
        }
      })
  }

  representatives: any = [];


  selectQuestionMaster(event: any) {
    console.log('event : ', event.value)
  }

  patternDecimal: RegExp = /^\d*\.?\d*$/;
  datetime: any;
  stateOptions: any = [];

  checkDisplayAnswer(support_data: any, question_type: any, typeOf: any): any {
    if (support_data == 'int' && question_type == 'number' && typeOf == 'int') { // int	number	int
      return 2;
    } else if (support_data == 'decimal' && question_type == 'number' && typeOf == 'decimal') { //decimal	number	decimal
      return 3;
    } else if (support_data == 'date' && question_type == 'text' && typeOf == 'string') {//date	text	string
      return 4;
    } else if (support_data == 'datetime' && question_type == 'text' && typeOf == 'string') {
      return 5;
    } else if ((support_data == 'Yes-No' || support_data == 'Right-Wrong') && question_type == 'check' && typeOf == 'int') {
      if (support_data == 'Yes-No') {
        this.stateOptions = [{ label: 'Có', value: 'Có', value_int: 1 }, { label: 'Không', value: 'Không', value_int: 0 }]
      } else {
        this.stateOptions = [{ label: 'Đúng', value: 'Đúng', value_int: 1 }, { label: 'Sai', value: 'Sai', value_int: 0 }]
      }
      return 6;
    } else if (support_data == null && question_type == 'select' && typeOf == 'int') {
      return 7;
    } else if (support_data == null && question_type == 'multi-select' && typeOf == 'int') {
      return 8;
    } else if (support_data == 'Provinces' && question_type == 'text' && typeOf == 'int') {
      return 9;
    } else if (support_data == 'Districts' && question_type == 'text' && typeOf == 'int') {
      return 10;
    } else if (support_data == 'Wards' && question_type == 'text' && typeOf == 'int') {
      return 11;
    } else if (support_data == null && question_type == 'final' && typeOf == 'int') {
      return 12;
    } else if (support_data == null && question_type == 'image' && typeOf == 'string') {
      return 13;
    } else if (support_data == 'string' && question_type == 'qr' && typeOf == 'string') {
      return 14;
    }
    else {
      return 1;
    }
  }


  oolItemDialog: boolean = false;
  oolItem!: any;
  submitted: boolean = false;
  statuses!: any[];

  itemAction: any = 'create'
  openNew() {
    // this.oolType = null
    this.itemAction = 'create'
    this.oolItem = {};
    this.submitted = false;
    this.oolItemDialog = true;
  }

  editOOLItem(oolItem: any) {
    this.itemAction = 'update'
    this.oolItem = { ...oolItem };
    this.oolItemDialog = true;
  }

  deleteOOLItem(oolItem: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteActionItem(oolItem);
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

  deleteActionItem(oolItem: any) {

    this._service.OOL_item_Action(Helper.ProjectID(), oolItem.ool_item_id, oolItem.ool_id, oolItem.item_name, oolItem.unit, oolItem.is_allow,
      oolItem.system_code, oolItem.question_master.question_type, oolItem.question_master.support_data, oolItem.question_master.typeOf,
      oolItem.min_data, oolItem.max_data, oolItem.order, oolItem.status, 'delete')
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.NofiResult(`Page OOL List`, `Delete OOL Item`, `Delete OOL Item success`, `success`, `SuccessFull`)
        } else {
          this.NofiResult(`Page OOL List`, `Delete OOL Item`, `Delete OOL Item error`, `error`, `Error`)
        }
        this.clearAction()
      })


  }


  clearAction() {
    this.oolItemDialog = false;
    this.oolItem = {};
    this.loadData(1)
  }
  hideDialog() {
    this.oolItemDialog = false;
    this.submitted = false;
  }

  saveOOLItem() {
    this.submitted = true;

    console.log('saveOOLItem : ', this.oolItem.question_master);

    if (this.NofiIsNull(this.oolItem.item_name, 'name') == 1 ||
      this.NofiIsNull(this.oolItem.question_master, 'question master') == 1 ||
      (Helper.IsNull(this.oolItem.min_data) != true && this.checkValue(this.oolItem.min_data, 'min data') == 1) ||
      (Helper.IsNull(this.oolItem.max_data) != true && this.checkValue(this.oolItem.max_data, 'max data') == 1) ||
      this.checkMinMax(this.oolItem.min_data, this.oolItem.max_data, 'Min data must be less than max data') == 1 ||
      (Helper.IsNull(this.oolItem.order) != true && this.checkValue(this.oolItem.order, 'order') == 1)) {
      return
    } else {
      this._service.OOL_item_Action(Helper.ProjectID(), (this.itemAction == 'create') ? 0 : this.oolItem.ool_item_id,
        this.inValue.ool_id, this.oolItem.item_name, this.oolItem.unit,
        (this.oolItem._is_allow == true) ? 1 : 0, this.oolItem.system_code,
        this.oolItem.question_master.question_type, this.oolItem.question_master.support_data, this.oolItem.question_master.typeOf,
        this.oolItem.min_data, this.oolItem.max_data, this.oolItem.order, (this.oolItem._status == true) ? 1 : 0, this.itemAction)
        .subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.NofiResult(`Page OOL List`, (this.itemAction == `create`) ? `Add details ool` : `Edit details ool`,
              (this.itemAction == `create`) ? `Add details ool success` : `Edit details ool success`, `success`, `SuccessFull`)
            this.clearAction()
          } else {
            this.NofiResult(`Page OOL List`, (this.itemAction == `create`) ? `Add details ool` : `Edit details ool`,
              (this.itemAction == `create`) ? `Add details ool error` : `Edit details ool error`, `error`, `Error`)
            this.clearAction()
          }
        })
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
