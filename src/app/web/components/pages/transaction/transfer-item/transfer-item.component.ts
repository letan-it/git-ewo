import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { TransactionsService } from 'src/app/web/service/transactions.service';

@Component({
  selector: 'app-transfer-item',
  templateUrl: './transfer-item.component.html',
  styleUrls: ['./transfer-item.component.scss']
})
export class TransferItemComponent {
  items_menu: any = [
    { label: ' TRANSACTION' },
    { label: ' Transfer', icon: 'pi pi-plus' },
  ];
  home: any = { icon: 'pi pi-chart-bar', routerLink: '/' };
  disabled_form = false
  project_id: any
  user_profile: string = 'current';
  currentUser: any;
  userProfile: any;
  UUID: any
  GetLanguage(key: string) {
    return Helper.GetLanguage(key)
  }
  constructor(
    private router: Router,
    private edService: EncryptDecryptService,
    private messageService: MessageService,
    private fileService: FileService,
    private _service: TransactionsService,
    private _serviceMaster: MastersService,
   
) { }
  menu_id = 88;
   
  check_permissions() {
      const menu = JSON.parse(localStorage.getItem('menu') + '')?.filter(
          (item: any) => item.menu_id == this.menu_id && item.check == 1
      );
      if (menu.length > 0) {
      } else {
          this.router.navigate(['/empty']);
      }
  }
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
  item_emp_ss: number = 0;
  selectEmployee(event: any) {
      this.item_emp_ss = event != null ? event.code : 0;
  }
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
  ngOnInit(): void {
        this.projectName ();
        this.check_permissions()
        this.UUID = AppComponent.generateGuid()
        this.project_id = Helper.ProjectID()
        this.loadUser()
        this.type_select = this.item_type_list[0]
        if ( this.type_select && this.type_select.code == 'PRODUCT' && this.listTypes && this.listTypes.length == 0){
            this.loadTypes ();
        } 
    
  }
  transaction: any = {
    transaction_note: "",
    transaction_type: "EMPLOYEE",
    transaction_status: 2,// Hoàn thành
    bill_type: "move_away",
 
  }
  transaction_item_product:any
  GetTotalProduct(list: any) {
    return list.filter((item:any) => item.item_type == 'PRODUCT').length
  }
   
    enterQRCODE() {
    if (this.item_detail == null) {
      this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please select  a item',
      });
      this.listQrCode =""
      return;
    }
   
    if ( this.type_select && this.type_select.code == 'PRODUCT' && Helper.IsNull(this.selectedType) == true){
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select product type',
        }); 
        return;
    } 
    this.transaction_item.push(
        {
            uuid: this.UUID,
            item_id: this.item_detail.id,
            item_name: this.item_detail.item_name,
            item_type: this.type_select.code,
            image: this.item_detail.item_image??this.item_detail.gift_image,
            item_type_vn: this.type_select.name,
            quantity: 1,
            barcode: this.listQrCode ,
            product_type: (Helper.IsNull(this.selectedType) != true && this.type_select.code == 'PRODUCT' ? this.selectedType.name : null) 
          
        }
    )
    this.listQrCode = ""
    this.transaction_item = Object.values(this.transaction_item.reduce((acc:any, item:any) => {
      let key = `${item.barcode}`;
      if (!acc[key]) {
          acc[key] = {
              ...item, quantity: 1,
              id: AppComponent.generateGuid()
          };
      }
    
      return acc;
    }, {}));

    this.transaction_item_product = Object.values(this.transaction_item.reduce((acc:any, item:any) => {
      let key = `${item.item_id}`;
      if (!acc[key]) {
          acc[key] = {
              ...item, quantity: 0,
              id: AppComponent.generateGuid()
          };
      }
      acc[key].quantity += item.quantity;
      return acc;
    }, {}));
    
    console.log(this.transaction_item);
    console.log(this.transaction_item_product);
    
  }
  list_file: any = [];
  filename: any = null;
  filepload: any = null
  deletefile(id:any) {
    this.list_file = this.list_file.filter((item:any) => item.url !== id);
}
onUploadFile(event: any) {
    this.filepload = event.target.files[0];
    if (this.filename == undefined || this.filename == '') {
        this.filename = this.filepload.name;
      }
      const formUploadImageBefore = new FormData();
      formUploadImageBefore.append('files', this.filepload);
      formUploadImageBefore.append('ImageType', 'TRANSACTION');
    //   this.fileService
    //       .UploadFile(formUploadImageBefore).subscribe((data: any) => {
    //           if (data.result == EnumStatus.ok) { 
    //               this.list_file.push({
    //                 file_name: this.filename,
    //                 url: EnumSystem.fileLocal + data.data,
    //               });
    //               this.clearListFile()
    //           }
    //   })

        const fileName = AppComponent.generateGuid();
        const newFile = new File([this.filepload], fileName+this.filepload.name.substring(this.filepload.name.lastIndexOf('.')),{type: this.filepload.type});
        const modun = 'TRANSACTION';
        const drawText = this.filename;
        this.fileService.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
            (response : any) => {     
 
                this.list_file.push({
                    file_name: this.filename,
                    url: response.url,
                  });
                  this.clearListFile()

            },
            (error : any) => { 
               
            }
        );
    
    
 
}
@ViewChild('myInput') myInput: any;
clearListFile() {
    this.filename = undefined;
    this.filepload = undefined;
  
    try {
      this.myInput.nativeElement.value = null;
    } catch (error) { }
  }
  item_detail: any 
  type_select: any 
  quantity:any = undefined
  listQrCode:any = undefined
  selectItemId(event: any) {
      this.item_detail = (event != null) ? event : null
  }
  
     
  typeInput: any = null;
    selectedListType(e: any) {
        console.log(e);
        this.typeInput = e.value === null ? 0 : e.value.item_code;
    }

    listTypes: any = [];  
    selectedType: any;
    loadTypes( ) {
        this._serviceMaster
            .ewo_Masters_GetList(
                Helper.ProjectID(),
                'product_type',
                'transaction_detail',
                '',
                1
            )
            .subscribe((data: any) => { 
                this.listTypes = []; 
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listTypes.push({
                            name: element.Code  
                        });
                    });
                    if ( Helper.IsNull( this.listTypes) != true &&  this.listTypes.length > 0 ){
                        this.selectedType = this.listTypes[0]
                    }
                }  
            });
    }
    onClearType() { 
        this.listTypes = [];
    }

  changeTypeItem() {
    this.item_detail = null 
  }
  item_type_list = [{ code: "PRODUCT", name: "Sản phẩm" }, { code: "GIFT", name: "Quà tặng" }]
  transaction_id: any
  DONE() {
       
    if (this.item_emp_ss == 0) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a leader',
        });
        return;
    }
 
    if (this.transaction_item.length == 0) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please add item',
        });
        return;
    }
    
    
    const detail_item = [] as any
    this.transaction_item.forEach((element:any) => {
        detail_item.push(
            {
                "item_id": element.item_id,
                "item_type": element.item_type,
                "barcode": element.barcode,
                "quantity": element.quantity,
                "product_type" :  element.product_type
                 
            }
        )
    });
    const file_item = [] as any
    this.list_file.forEach((element:any) => {
        file_item.push(
            {
                "file_url": element.url,
                "file_name": element.file_name,
                "file_type": "transactions"
            }
        )
    });
  
        
    var param = {
        "transaction_from": this.userProfile.employee_id,
        "transaction_to": this.item_emp_ss,
        "transaction_type": this.transaction.transaction_type,
        "note": this.transaction.transaction_note,
        "transaction_status": this.transaction.transaction_status,
        "project_id": Helper.ProjectID(),
        "bill_type": this.transaction.bill_type,
        "detail": detail_item,
        "file": file_item
    } 
    this._service.CREATE_Transaction_scan(param).subscribe((res:any) => {
        if (res.result == EnumStatus.ok) { 
            console.log(res);
            this.UUID = res.data.transaction[0].UUID
            this.transaction_id = res.data.transaction[0].transaction_id
            
            this.disabled_form = true
            this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: 'Thành công - Seri: ' + this.UUID,
            });
        }
    })
    
   
}
copyText(val: string) {
   
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
  transaction_item: any = []
  delete_item(item_id: any ) {
    this.transaction_item = this.transaction_item.filter((item:any) => item.id !== item_id);
    
  }
  delete_item_productbarcode(item_barcode: any) {
    this.transaction_item = this.transaction_item.filter((item: any) => item.barcode !== item_barcode);

    this.transaction_item_product = Object.values(this.transaction_item.reduce((acc:any, item:any) => {
      let key = `${item.item_id}`;
      if (!acc[key]) {
          acc[key] = {
              ...item, quantity: 0,
              id: AppComponent.generateGuid()
          };
      }
      acc[key].quantity += item.quantity;
      return acc;
    }, {}));
    
  }
  delete_item_product(item_id: any) {
    this.transaction_item_product = this.transaction_item_product.filter((item:any) => item.item_id !== item_id);
    this.transaction_item = this.transaction_item.filter((item: any) => item.item_id !== item_id);

    this.transaction_item_product = Object.values(this.transaction_item.reduce((acc:any, item:any) => {
      let key = `${item.item_id}`;
      if (!acc[key]) {
          acc[key] = {
              ...item, quantity: 0,
              id: AppComponent.generateGuid()
          };
      }
      acc[key].quantity += item.quantity;
      return acc;
    }, {}));
    

  }
  pushItem() {
    if (this.quantity < 0) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please enter a quantity',
        });
        return;
    }
    if (this.item_detail == null) {
        this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select  a item',
        });
        return;
    }
    this.transaction_item.push(
        {
            uuid: this.UUID,
            item_id: this.item_detail.id,
            item_name: this.item_detail.item_name,
            item_type: this.type_select.code,
            image: this.item_detail.item_image??this.item_detail.gift_image,
            item_type_vn: this.type_select.name,
            quantity: this.quantity,
            barcode: null
           
        }
    )
    this.transaction_item = Object.values(this.transaction_item.reduce((acc:any, item:any) => {
        let key = `${item.uuid}_${item.item_id}_${item.item_type}_${item.barcode}`;
        if (!acc[key]) {
            acc[key] = {
                ...item, quantity: 0,
                id: AppComponent.generateGuid()
            };
        }
        acc[key].quantity += item.quantity;
        return acc;
    }, {}));
    this.quantity = undefined

}


}
