
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { AppComponent } from 'src/app/app.component';
import * as FileSaver from 'file-saver';
import { GiftsService } from 'src/app/web/service/gifts.service';
import { Pf } from 'src/app/_helpers/pf';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { FileService } from 'src/app/web/service/file.service';
import { TransactionsService } from 'src/app/web/service/transactions.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class TransactionsComponent {

  constructor(private _service: TransactionsService,
    private masters: MastersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private edService: EncryptDecryptService,
    private taskService: TaskFileService,
    private fileService: FileService,
    private router: Router,) { }

  items_menu: any = [
    { label: ' ACTIVATION' },
    { label: ' Transactions', icon: 'pi pi-sitemap', routerLink: '/activation/transactions' },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

  project_id: any = Helper.ProjectID();

  menu_id = 71;
  check_permissions() {
    const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
      (item: any) => item.menu_id == this.menu_id && item.check == 1
    );
    if (menu?.length > 0) {
    } else {
      this.router.navigate(['/empty']);
    }
  }

  items: any = [];
  project:any 
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    try {
      this.check_permissions();
    } catch (error) { }

    // this.getTransType();
    // this.getTransStatus();
    this.getMaster('transaction_type', 'transactions', this.transTypeList, 1)
    this.getMaster('transactions.item_tpye', 'transaction_detail', this.itemTypeList, 1)
    this.getMaster('transactions.status', 'transactions', this.transStatusList, 2)
    this.getMaster('transactions.bill_type', 'transactions', this.transBillList, 2)

    this.getDate();
    this.projectName();
    this.loadUser();
    this.loadData(1);
  }

  currentUser: any;
  userProfile: any;

  loadUser() {
    let _u = localStorage.getItem(EnumLocalStorage.user);
    this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
    this.userProfile = this.currentUser.employee[0];
  }

  checkUser(): any {
    return (this.userProfile?.employee_type_id == 1) ? true : false
  }

  file_type: any = 'transactions';

  transTypeList: any = []
  transaction_type: any = null
  selectTransType(event: any) {
    this.transaction_type = (Helper.IsNull(event) != true) ? event.value : null;
    this.transaction.transaction_type = (Helper.IsNull(event) != true) ? event.value : null;
  }

  transStatusList: any = []
  transaction_status: any = null
  selectTransStatus(event: any) {
    this.transaction_status = (Helper.IsNull(event) != true) ? event.value : null;
    this.transaction.transaction_status = (Helper.IsNull(event) != true) ? event.value : null;
  }

  selectChangeStatus(event: any, item: any) {
    item.transaction_status = (Helper.IsNull(event) != true) ? event.value : null;
  }


  transBillList: any = []
  bill_type: any = null
  selectTransBill(event: any, key: any) {
    if (key == 'filter') {
      this.bill_type = (Helper.IsNull(event) != true) ? event.value : null;
    } else {
      this.transaction.bill_type = (Helper.IsNull(event) != true) ? event.value : null;
    }

  }


  itemTypeList: any = []
  selectItemType(event: any) {
    this.transaction.item_type = (Helper.IsNull(event) != true) ? event.value : null;
  }

  getMaster(ListCode: any, Table: any, list: any, key: any) {
    this.masters.ewo_GetMaster(Helper.ProjectID())
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          // list = []
          const result = data.data.filter((x: any) => x.Status == 1 && x.ListCode == ListCode && x.Table == Table)
          result.forEach((element: any) => {
            list.push({
              id: element.Id,
              name: (key == 1) ? `${element.Code} - ${element.NameVN}` :
                `${element.NameVN}`,
              code: element.Code
            })
          });
        }
      })

  }
  minDate: any = null;
  maxDate: any = null;
  start: any = null;

  rangeDates: any = [];
  // [ "2023-12-31T17:00:00.000Z", "2024-01-02T17:00:00.000Z" ]

  getDate() {
    // this.rangeDates[0] = new Date("2024-01-01")
    // this.rangeDates[1] = new Date("2024-01-03"); 

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    this.minDate = new Date();
    this.minDate.setDate(1)
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = new Date();
    this.maxDate.setDate(0)
    this.maxDate.setMonth(prevMonth);
    this.maxDate.setFullYear(prevYear);

    this.start = new Date();
    this.start.setDate(1);

    // minDate - minDate ( Today : 01/03/2024 || 02/03/2024)  
    if (today.getDate() == 1 || today.getDate() == 2) {
      this.rangeDates[0] = new Date(this.minDate);
      this.rangeDates[1] = new Date(this.maxDate);
    } else {
      this.rangeDates[0] = new Date(this.start);
      this.rangeDates[1] = new Date();
    }

  }

  getData() {

    this.created_date_from = (Helper.IsNull(this.rangeDates[0]) != true) ?
      Helper.transformDateInt(new Date(this.rangeDates[0])) : null
    this.created_date_to = (Helper.IsNull(this.rangeDates[1]) != true) ?
      Helper.transformDateInt(new Date(this.rangeDates[1])) : null


  }


  transaction_from: number = 0;
  selectAdmin(event: any, action: any) {
    if (action == 'filter') {
      this.transaction_from = event != null ? event.code : 0;
    } else {
      this.transaction.transaction_from = event != null ? event.code : 0;
    }


  }
  transaction_to: number = 0;
  selectLeader(event: any, action: any) {
    if (action == 'filter') {
      this.transaction_to = event != null ? event.code : 0;
    } else {
      this.transaction.transaction_to = event != null ? event.code : 0;
    }
  }
  created_by: number = 0;
  selectCreate(event: any) {
    this.created_by = event != null ? event.code : 0;
  }



  first: number = 0;
  rows: number = 20;
  totalRecords: number = 0
  _pageNumber: any = 0
  onPageChange(e: any) {
    this.first = e.first
    this.rows = e.rows
    this._pageNumber = (this.first + this.rows) / this.rows
    this.loadData(this._pageNumber)
  }

  // BIEN
  transaction_id: any = 0;
  uuid: any = null;
  created_date_from: any = null;
  created_date_to: any = null;


  listTransactions: any = [];
  selectedTransactions: any = [];
  loading: boolean = false;
  loadData(pageNumber: any) {

    if (pageNumber == 1) {
      this.first = 1
      this.totalRecords = 0
      this._pageNumber = 1
    }
    this.loading = true;
    this.getData();
    // return;

    var employee_id = (this.checkUser() == false && Helper.IsNull(this.userProfile) != true) ? this.userProfile?.employee_id : this.created_by;
    console.log(employee_id);
    this._service.GET_transactions(this.transaction_id, this.uuid,
      (this.checkUser() == false && Helper.IsNull(this.userProfile) != true) ? this.userProfile?.employee_id : this.transaction_from,
      this.transaction_to,
      Helper.IsNull(this.transaction_type) != true ? this.transaction_type.code : '',
      this.created_by,
      this.created_date_from, this.created_date_to,
      Helper.IsNull(this.transaction_status) != true ? this.transaction_status.id : null,
      Helper.ProjectID(),
      Helper.IsNull(this.bill_type) != true ? this.bill_type.code : '')
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {

          this.listTransactions = data.data.transaction
          this.listTransactions = this.listTransactions.map((t: any) => ({
            ...t,
            _transaction_from: `[${t.transaction_from}] - ${t.from_code} - ${t.from_name}`,
            _transaction_to: `[${t.transaction_to}] - ${t.to_code} - ${t.to_name}`,
            _transaction_status: `[${t.transaction_status}] - ${t.transaction_status_code} - ${t.transaction_status_name}`,
            _bill_type: `${t.bill_type} - ${t.bill_type_name}`,
            _created_by: `[${t.created_by}] - ${t.created_code} - ${t.created_name} | UUID : ${t.UUID}`,
            created_date_Str: Helper.convertDateStr(t.created_date_Int),
          }))

          this.totalRecords = this.listTransactions.length > 0 ? this.listTransactions[0].TotalRows : 0
          this.loading = false;
          console.log('this.listTransactions : ', this.listTransactions);

        } else {
          this.listTransactions = []
          this.loading = false;
        }
      })

  }

  listDetails: any = []
  getTransactionDetails(transaction_id: any, item: any) {
    this._service.GET_Tractionsaction_detail(Helper.ProjectID(), transaction_id)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          data.data.transaction_detail = data.data.transaction_detail.map((t: any) => ({
            ...t,
            _item: (t.item_type == 'PRODUCT') ? `[${t.item_id}] - ${t.product_code} - ${t.product_name}` :
              `[${t.item_id}] - ${t.gift_code} - ${t.gift_name}`,
          }))

          data.data.transaction_file = data.data.transaction_file.map((f: any) => ({
            ...f,
            file_name: f.file_name,
            url: f.file_url,
          }))
          this.listDetails = data.data
          item.listDetails = data.data
        }
      })
  }


  openNewDetails() {

  }

  saveQuantityDeatils(event: any) {
    console.log('saveQuantityDeatils : ', event.value)
  }

  onRowEditSave(item: any, action: any) {

    //  action = create.update || delete 
    var type = (item.item_type == 'PRODUCT') ? 'product' : 'gift';
    var type_name = (item.item_type == 'PRODUCT') ? `[${item.item_id}] - ${item.product_code} - ${item.product_name}` :
      `[${item.item_id}] - ${item.gift_code} - ${item.gift_name}`;

    this._service.transaction_detail_Action(item.transaction_id, item.UUID, item.item_id, item.item_type,
      item.quantity, item.barcode, Helper.ProjectID(), action)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {

          this.NofiResult('Page Transaction',
            `Update item`,
            (action == 'create.update.web') ? `Updated the quantity = ${item.quantity} of the ${type} (${type_name}) successfully` :
              `Delete ${type} (${type_name}) successful`, 'success', 'SuccessFull');

          this.listTransactions.forEach((element: any) => {
            if (element.transaction_id == item.transaction_id) {
              element.listDetails = data.data.transaction_detail;
            }
          });
          this.clearSaveTransaction();

        }
      })
  }

  deleteTransaction(item: any, action: any) {

    this._service.transactions_Action(item.transaction_id, item.transaction_from, item.transaction_to, item.transaction_type,
      item.transaction_status, item.note, Helper.ProjectID(), item.bill_type, action)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {

          this.NofiResult('Page Transaction',
            `Delete transaction`,
            `Delete transaction (transaction_id = ${item.transaction_id}) successfully`, 'success', 'SuccessFull');

          this.clearSaveTransaction();

        }
      })
  }


  onClickChangeStatus(item: any) {
    item.transaction_status_item = this.transStatusList.filter((s: any) => s.id == item.transaction_status)[0];
  }
  changeTranStatus(item: any) {
    console.log('item : ', item);
    if (this.NofiIsNull(item.transaction_status_item, 'status') == 1) {
      return;
    } else {
      console.log(item.transaction_id, item.transaction_from, item.transaction_to, item.transaction_type,
        (Helper.IsNull(item.transaction_status_item) != true) ? item.transaction_status_item.id : 1,
        item.note, Helper.ProjectID(), item.bill_type, item.transaction_status_item.code)

      this._service.transactions_Action(item.transaction_id, item.transaction_from, item.transaction_to, item.transaction_type,
        (Helper.IsNull(item.transaction_status_item) != true) ? item.transaction_status_item.id : 1,
        item.note, Helper.ProjectID(), item.bill_type, item.transaction_status_item.code)
        .subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.NofiResult('Page Transaction',
              `Change transaction status`,
              `Change transaction status (${item.transaction_status_item.name} - ID : ${item.transaction_id}) successfully`, 'success', 'SuccessFull');
            console.log('changeTranStatus ->', data.data);
            this.clearSaveTransaction()
          }

        })
    }
  }
  deleteItem(event: Event, item: any, action: any, key: any) {
    // key = transaction /item
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        if (key == 'transaction') {
          this.deleteTransaction(item, action);
        } else {
          this.onRowEditSave(item, action);
        }

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }


  onRowEditCancel() {
    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }

  onRowEditCancelStatus(item: any) {
    item.transaction_status_item = this.transStatusList.filter((s: any) => s.id == item.transaction_status)[0];
    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }


  showFiter: any = true;
  showFilter() {
    this.showFiter = !this.showFiter
  }



  transactionDialog: boolean = false;
  transaction: any = [];
  item_transaction: any = [];
  statuses!: any[];


  openNew(item: any, actionView: any) {

    this.item_transaction = item;
    this.transaction = {};
    this.transaction.note = null;
    if (this.checkUser() == false && Helper.IsNull(this.userProfile) != true) {
      this.transaction.transaction_from = this.userProfile?.employee_id
    }

    this.transaction.actionView = actionView;
    this.transaction.action = 'create';
    this.transactionDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected transaction?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  editTransaction(transaction: any, item: any) {
    this.transaction = { ...transaction };
    this.transaction.action = 'update';
    this.transactionDialog = true;
  }

  deleteProduct(transaction: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete transaction ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'any Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.transactionDialog = false;
  }

  changeTypeItem() {
    this.transaction.item_id = null;
    this.transaction.item = null
  }
  selectItemId(event: any) {
    this.transaction.item = (event != null) ? event : null
  }

  saveTransaction() { }

  save() {

    // actionView => transaction /item
    if (this.transaction.actionView == 'transaction') {
      try {
        this.transaction.transaction_type = (Helper.IsNull(this.transTypeList[0]) != true) ? this.transTypeList[0].code : null
        this.transaction.bill_type = (Helper.IsNull(this.transBillList[0]) != true) ? this.transBillList[0].code : null
        this.transaction.status = 1;
      } catch (error) { }

      if (this.NofiIsNull(this.transaction.transaction_type, 'type') == 1 ||
        this.NofiIsNull(this.transaction.transaction_from, 'from') == 1 ||
        this.NofiIsNull(this.transaction.transaction_to, 'to') == 1 ||
        this.NofiIsNull(this.transaction.status, 'status') == 1 ||
        this.NofiIsNull(this.transaction.bill_type, 'bill type') == 1) {
        return;
      }
      else {

        this._service.transactions_Action(
          (this.transaction.action == 'create') ? 0 : this.transaction.transaction_id,
          this.transaction.transaction_from, this.transaction.transaction_to,
          this.transaction.transaction_type, this.transaction.status, this.transaction.note,
          Helper.ProjectID(), this.transaction.bill_type, this.transaction.action)
          .subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
              this.NofiResult('Page Transaction',
                `Create trasaction`,
                `Create trasaction successful`, 'success', 'SuccessFull');
              this.clearSaveTransaction();
            }
          })
      }
    } else if (this.transaction.actionView == 'item') {
      this.saveItem();
    } else if (this.transaction.actionView == 'file') {
      this.saveFileTransaction(this.list_file, 'create')
      this.clearSaveTransaction();
    }
  }

  saveItem() {
    if (this.NofiIsNull(this.transaction.item_type, 'type') == 1 ||
      this.NofiIsNull(this.transaction.item, 'item') == 1 ||
      this.NofiIsNull(this.transaction.quantity, 'quantity') == 1
    ) {
      return
    } else {
      const item_create = ({
        transaction_id: this.item_transaction.transaction_id,
        UUID: this.item_transaction.UUID,
        item_id: this.transaction.item.id,
        item_type: this.transaction.item_type.code,
        quantity: this.transaction.quantity,
        barcode: null,
        product_code: this.transaction.item.item_code,
        product_name: this.transaction.item.item_name,
        gift_code: this.transaction.item.item_code,
        gift_name: this.transaction.item.item_name,
      })
      this.onRowEditSave(item_create, 'create.update.web');
    }

  }

  saveFileTransaction(list_file: any, action: any) {
    var transaction_history_id = 0;

    if (Helper.IsNull(list_file) != true) {
      list_file.forEach((element: any) => {
        console.log(this.item_transaction.transaction_id,
          this.item_transaction.UUID,
          element.url, element.file_name, this.file_type,
          this.item_transaction.transaction_status, Helper.ProjectID(), transaction_history_id, action)
      });

      list_file.forEach((element: any) => {
        this._service.transaction_file_Action(this.item_transaction.transaction_id,
          this.item_transaction.UUID, element.url, element.file_name, this.file_type,
          this.item_transaction.transaction_status, Helper.ProjectID(), transaction_history_id, action)
          .subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
              this.NofiResult('Page Transaction',
                `Create file`,
                `Create file successful`, 'success', 'SuccessFull');
              this.clearListFile();
            }
          })
      });
    }
  }


  clearListFile() {
    this.filename = undefined;
    this.filepload = undefined;
    this.list_file = [];
    try {
      this.myInput.nativeElement.value = null;
    } catch (error) { }

  }

  clearSaveTransaction() {


    // Action Add File
    this.clearListFile();
    // action transaction || action details 


    // this.loadData(1);

    // if (this.transaction.actionView != 'item' && this.transaction.actionView != 'file') {
    //   this.loadData(1);
    // }
    // if (this.transaction.actionView == 'item' || this.transaction.actionView == 'file') {
    //   this.getTransactionDetails(this.item_transaction.transaction_id,
    //     this.listTransactions.filter((x: any) => x.transaction_id == this.item_transaction.transaction_id));
    // }

    this.transactionDialog = false;
    this.transaction = {};
    this.item_transaction = {};

  }



  checkDate(time: any, name: any) {
    let check = 0
    // time.some((e: any) => e == null)
    if (Helper.IsNull(time) == true || time.length != 2) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: name,
      });
      check = 1
    }
    return check
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

  convertDateStr(value: any): any {
    return Helper.convertDateStr(value)
  }



  getSeverityItemType(value: any): any {
    switch (value) {
      case 'PRODUCT':
        return 'info';
      case 'GIFT':
        return 'success';
      default:
        return 'warning';
    }
  }

  getSeverityType(value: any): any {
    switch (value) {
      case 'EMPLOYEE':
        return 'info';
      case 'SHOP':
        return 'success';
      default:
        return 'warning';
    }
  }

  // Status -> Tag (close (yellow), draft( Blue nhạt), Done (Green ), OK (Blue) , Reject (Red) ??? -> APP)  
  getSeverityStatus(value: any): any {
    switch (value) {
      case 'close':
        return 'warning';
      case 'draft':
        return 'help';
      case 'Done':
        return 'success';
      case 'OK':
        return 'primary';
      default:
        return 'danger';
    }
  }


  getSeverityBill(value: any): any {
    switch (value) {
      case 'move_back':
        return 'danger';
      case 'move_away':
        return 'success';
      default:
        return 'warning';
    }
  }


  removeList: any
  removeItem(itemToRemove: any): void {
    this.removeList = this.list_file.filter(
      (e: any) => e.url == itemToRemove
    );
    this.list_file = this.list_file.filter(
      (item: any) => item.url !== itemToRemove
    );

  }


  @ViewChild('myInput') myInput: any;
  list_file: any = [];
  filename: any = null;
  filepload: any = null
  updateFile: any = []
  onUploadFile(event: any) {
    this.updateFile = []
    this.filepload = event.target.files[0];

    if (this.filename == undefined || this.filename == '') {
      this.filename = this.filepload.name;
    }
    const formUploadImageBefore = new FormData();
    formUploadImageBefore.append('files', this.filepload);
    formUploadImageBefore.append('ImageType', 'TaskList');

    // this.fileService
    //   .UploadFile(formUploadImageBefore)
    //   .subscribe((data: any) => {
    //     if (data.result == EnumStatus.ok) {
    //       this.list_file.push({
    //         file_name: this.filename,
    //         url: EnumSystem.fileLocal + data.data,
    //       });
    //       this.updateFile.push({
    //         file_name: this.filename,
    //         url: EnumSystem.fileLocal + data.data,
    //       });

    //     }

    //   });

      const fileName = ( Helper.IsNull (this.filename) != true )? this.filename : AppComponent.generateGuid();
      const newFile = new File([this.filepload], fileName+this.filepload.name.substring(this.filepload.name.lastIndexOf('.')),{type: this.filepload.type});
      const modun = 'TASK-LIST';
      const drawText = this.filename ;
      this.fileService.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
          (response : any) => {      
              
              this.list_file.push({
                file_name: this.filename,
                url: response.url,
              });
              this.updateFile.push({
                file_name: this.filename,
                url: response.url,
              });

          },
          (error : any) => { 
             
          }
      );
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
