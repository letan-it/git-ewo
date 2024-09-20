import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { ProductService } from 'src/app/web/service/product.service';
import * as FileSaver from 'file-saver';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-group-product',
  templateUrl: './group-product.component.html',
  styleUrls: ['./group-product.component.scss']
})
export class GroupProductComponent {

  menu_id = 107;
  items_menu: any = [
    { label: ' MASTER' },
    {
      label: ' Product',
      icon: 'pi pi-database',
      routerLink: '/osa/product',
    },
    {
      label: ' Group Product',
      icon: 'pi pi-sitemap'
    },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
  cols!: Column[];

  check_permissions() {
    const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
      (item: any) => item.menu_id == this.menu_id && item.check == 1
    );
    if (menu.length > 0) {
    } else {
      this.router.navigate(['/empty']);
    }
  }

  showAddDialog: boolean = false;
  showEditDialog: boolean = false;

  constructor(
    private _service: ProductService,
    private messageService: MessageService,
    private router: Router,
    private edService: EncryptDecryptService,
    private confirmationService: ConfirmationService,
  ) { }

  ListGroupProduct: any = [];
  edit_project_id!: number;
  group_code: string = "";
  edit_group_code: any;
  group_name: string = "";
  edit_group_name: any;
  order!: number;
  edit_order: any;

  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;
  isLoading_Filter: boolean = false;
  LoadData(pageNumber: number) {
    if (pageNumber == 1) {
      this.first = 0;
      this.totalRecords = 0;
      this._pageNumber = 1;
    }
    this.isLoading_Filter = true;

    this.ListGroupProduct = [];
    console.log(this.group_code);
    this._service.ewo_Product_Group_GetList(
      Helper.ProjectID(),
      this.group_code,
      this.group_name,
      this.rows,
      pageNumber
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        if (data.data.length > 0) {
          this.ListGroupProduct = data.data;
          this.totalRecords = Helper.IsNull(this.ListGroupProduct) != true ? this.ListGroupProduct[0].TotalRows : 0;
          this.isLoading_Filter = false;
        } else {
          this.ListGroupProduct = [];
          this.isLoading_Filter = false;
        }
      }
    });
  }

  showFilter: number = 1;
  ShowHideFilter() {
    if (this.showFilter == 1) {
      this.showFilter = 0;
    } else {
      this.showFilter = 1;
    }
  }

  ngOnInit(): void {
    this.check_permissions();
    this.LoadData(1);
    // this.loadUser();
  }

  selectedGroupCode: any;
  openNew() {
    this.showAddDialog = true;
  }
  saveGroupProduct(event: Event) {
    if (this.group_code === "" || this.group_name === "" || this.order === null) {
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
    } else {
      console.log(Helper.ProjectID());
      console.log(this.group_code);
      console.log(this.group_name);
      console.log(+this.order);
      console.log('create');

      this._service.ewo_Product_Group_Action(
        Helper.ProjectID(),
        this.group_code,
        this.group_name,
        this.order,
        'create'
      ).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.ListGroupProduct = [];
          this.showAddDialog = false;
          this.LoadData(1);

          // clear value
          this.group_code = "";
          this.group_name = "";
          this.order = 0;

          this.messageService.add({
            severity: 'success',
            summary: 'Add new Group Code successfully',
            detail: '',
          })
        } else {
          this.showAddDialog = false;
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: '',
          });
        }
      })
    }
  }

  openEdit(groupProduct: any) {
    this.edit_group_code = groupProduct.group_code;
    this.edit_group_name = groupProduct.group_name;
    this.edit_order = groupProduct.order

    this.showEditDialog = true;
  }
  editGroupCode() {
    this._service.ewo_Product_Group_Action(
      Helper.ProjectID(),
      this.edit_group_code,
      this.edit_group_name,
      this.edit_order,
      'update'
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.showEditDialog = false;
        this.LoadData(1);

        this.messageService.add({
          severity: 'success',
          summary: 'Update Group Code successfully',
          detail: '',
        })
      } else {
        this.showEditDialog = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }

  deleteCategory(groupProduct: any, event: any) {
    this.edit_group_code = groupProduct.group_code;
    this.edit_group_name = groupProduct.group_name;
    this.edit_order = groupProduct.order;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._service.ewo_Product_Group_Action(
          Helper.ProjectID(),
          this.edit_group_code,
          this.edit_group_name,
          this.edit_order,
          'delete'
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.LoadData(1);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Group Code successfully',
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

  // RawData
  exportRawData() {
    this._service.ewo_Product_Group_RawData(
      Helper.ProjectID(),
      "",
      "",
      0,
      0
    )
  }

  // GetTemplate
  getTemplate() {
    this._service.ewo_Product_Group_GetTemplate(Helper.ProjectID());
  }

  // ImportData
  showImport: number = 0;
  showImportDialog() {
    this.showImport = 1;
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
    const formDataUpload = new FormData();
    formDataUpload.append('files', this.fileTemplate);

    this._service
      .ewo_Product_Group_ImportData(formDataUpload, Helper.ProjectID())
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          console.log(data);
          if (data.data === 1) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successful Group Code registration',
            });

            this.clearFileInput();
            this.LoadData(1);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error Group Code registration',
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
      });
  }
  // 'xlsx'
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataError);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ['data'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'group_code_list');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
