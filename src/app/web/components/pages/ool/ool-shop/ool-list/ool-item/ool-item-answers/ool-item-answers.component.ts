import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumAction, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { OolService } from 'src/app/web/service/ool.service';
import { ProductService } from 'src/app/web/service/product.service';

@Component({
  selector: 'app-ool-item-answers',
  templateUrl: './ool-item-answers.component.html',
  styleUrls: ['./ool-item-answers.component.scss']
})
export class OolItemAnswersComponent {

  @Input() inValue: any;
  @Input() action: any = 'view';

  products!: any[];
  statuses!: any[];
  clonedProducts: { [s: string]: any } = {};

  constructor(
    private _service: OolService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.loadData()
  }

  listItemAnswers: any = []
  loadData() {
    this._service.OOL_item_answers_GetList(Helper.ProjectID(), this.inValue.ool_item_id)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.listItemAnswers = data.data
          this.listItemAnswers = this.listItemAnswers.map((x: any) => ({
            ...x,
            _status: x.status == 1 ? true : false
          }))
        } else {
          this.listItemAnswers = []
        }
        console.log('ANSWER', this.listItemAnswers)
      })
  }



  oolItemAnswerDialog: boolean = false;
  oolItemAnswer!: any;
  submitted: boolean = false;

  itemAction: any = 'create'
  openNew() {
    // this.oolType = null
    this.itemAction = 'create'
    this.oolItemAnswer = {};
    this.submitted = false;
    this.oolItemAnswerDialog = true;
  }

  editOOLItemAnswer(item: any) {
    this.itemAction = 'update'
    this.oolItemAnswer = { ...item };
    this.oolItemAnswerDialog = true;
  }
  deleteOOLItemAnswer(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteActionItemAnswer(item);
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

  deleteActionItemAnswer(item: any) {

    this._service.OOL_item_answers_Action(Helper.ProjectID(), item.ool_answer_id, item.ool_item_id, item.value, item.status, 'delete')
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.NofiResult(`Page OOL List`, `Delete answer`, `Delete answer success`, `success`, `SuccessFull`)
        } else {
          this.NofiResult(`Page OOL List`, `Delete answer`, `Delete Answer error`, `error`, `Error`)
        }
        this.clearSaveAnswer();
      })


  }

  hideDialog() {
    this.oolItemAnswerDialog = false;
    this.submitted = false;
  }

  saveAnswers() {
    this.submitted = true;

    if (this.NofiIsNull(this.oolItemAnswer.value, 'value') == 1) {
      return;
    } else {
      this._service.OOL_item_answers_Action(Helper.ProjectID(), (this.itemAction == 'create') ? 0 : this.oolItemAnswer.ool_answer_id,
        (this.itemAction == 'create') ? this.inValue.ool_item_id : this.oolItemAnswer.ool_item_id,
        this.oolItemAnswer.value, (this.oolItemAnswer._status == true) ? 1 : 0, this.itemAction)
        .subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.NofiResult(`Page OOL List`, (this.itemAction == `create`) ? `Add answer` : `Edit answer`,
              (this.itemAction == `create`) ? `Add answer success` : `Edit answer success`, `success`, `SuccessFull`)
          } else {
            this.NofiResult(`Page OOL List`, (this.itemAction == `create`) ? `Add answer` : `Edit answer`,
              (this.itemAction == `create`) ? `Add answer error` : `Edit answer error`, `error`, `Error`)
          }
          this.clearSaveAnswer()
        })
    }

  }
  clearSaveAnswer() {
    // this.products = [...this.products];
    this.oolItemAnswerDialog = false;
    this.oolItemAnswer = {};
    this.loadData()
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
    if (min > max && Helper.IsNull(min) != true && Helper.IsNull(max) != true) {
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
