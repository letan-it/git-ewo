import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Pf } from 'src/app/_helpers/pf';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { UserService } from 'src/app/web/service/user.service';
import { SummaryWorkshiftService } from '../service/summary-workshift.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report-workshift',
  templateUrl: './report-workshift.component.html',
  styleUrls: ['./report-workshift.component.scss']
})
export class ReportWorkshiftComponent {
  sidebarVisible: boolean = false;
  constructor(
    private activate: ActivatedRoute,
    private userService: UserService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
    public acti_service: ActivationService,
    private summaryWorkshift: SummaryWorkshiftService
  ) {}

  dateStart?: any | undefined;
  dateEnd?: any | undefined;

  GetLanguage(key: string) {
    return Helper.GetLanguage(key)
  }
  getLanguage() {
    this.masterService.ewo_GetLanguage(this.project_id).subscribe((data: any) => { 
      if (data.result == EnumStatus.ok) {
        localStorage.setItem('key_language','vn')
        localStorage.setItem('language',JSON.stringify(data.data))
      }
    })
  }

  employee_id: any;
  shop_id: any;
  date: any;
  userDecrypt:any
  loginByToken(token: string) {
    localStorage.setItem('theme-config','{"config":{"ripple":false,"inputStyle":"outlined","menuMode":"overlay","colorScheme":"light","theme":"bootstrap4-light-blue","scale":9},"state":{"staticMenuDesktopInactive":false,"overlayMenuActive":false,"profileSidebarVisible":false,"configSidebarVisible":false,"staticMenuMobileActive":false,"menuHoverActive":false,"theme":false}}')
    this.userService.loginByToken(token)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          let user_current = data.data;
          // console.log(data);
          const project = user_current.projects.filter(
            (p: any) => p.project_id == Helper.ProjectID()
          );
          if (project.length > 0) {
            const userEncrypt = this._edCrypt.encryptUsingAES256(
              JSON.stringify(user_current.employee[0])
            );
            this.employee_id = user_current.employee[0].employee_id;
            localStorage.setItem(
              EnumLocalStorage.user_profile,
              userEncrypt
            );
            this.userDecrypt = user_current.employee[0];

            const dataEncrypt = this._edCrypt.encryptUsingAES256(
              JSON.stringify(user_current)
            );

            localStorage.setItem(
              EnumLocalStorage.user,
              dataEncrypt
            );
            this.getLanguage()
            this.getDate()
            // this.filter()              
          } else {
            alert('No project decentralization');
          }
        } else {
          alert('Wrong login information');
        }
      }
    );
  }

  project_id:number = 0
  ngOnInit(): void {
    this.project_id = Helper.ProjectID()
    localStorage.removeItem('_u')
    localStorage.removeItem('user_profile')
  
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (Helper.getPrams('token', this.activate)) {
      this.date = this.activate.snapshot.queryParamMap.get('date');
      this.shop_id = this.activate.snapshot.queryParamMap.get('shopId');   
      this.loginByToken(Helper.getPrams('token', this.activate));
    } 
  }

  currDate?: string;
  calendarVal: any = null;
  calendarValue: any = null;
  created_date_int: any = null;
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+ 1;
    let day = date.getDate();

    this.currDate = `${day>9?day:"0"+day}/${month>9?month:"0"+month}/${year}`; 
    this.loadData()
  }
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  setDate(date: any) {
    if (Helper.IsNull(date) != true) {
      this.created_date_int = Helper.convertDate(new Date(date))
      this.created_date_int = Helper.transformDateInt(new Date(this.created_date_int))
    } else {
      this.created_date_int = null;
    }
  }

  changeDate(event: any) {
    console.log(event);
  }

  listProduct: any
  listSmoker: any
  listSummary: any
  listGift: any;
  select: any
  ListData!: any[];
  openDetail(item:any) {
    if (item.detail == 0) {
      item.detail = 1
      this.getDetail(item)
    }
    else {
      item.detail = 0
    }
  }
  getDetail(item: any) {
    const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
    const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));
    this.acti_service.MOBILE_web_GetSellOutReport(Helper.ProjectID(),
     intDateStart, intDateEnd, 'detail', item.UUID).subscribe((result: any) => {
      if (result.result == EnumStatus.ok) {
        // console.log(result);
        item.data_detail = result.data.data
        // console.log(item);
      }
    })
  }
  loadData() {
    this.summaryWorkshift.MOBILE_web_SummarySellOut_JSE(
      this.project_id,
      this.employee_id,
      parseInt(this.shop_id),
      parseInt(this.date)
    ).subscribe((data: any) => {  
      if (data.result == EnumStatus.ok) {
        console.log(data);
        this.listProduct = data.data.product_list
        this.listSmoker = data.data.smoker_list
        this.listSummary = data.data.summary[0]
        this.listGift = data.data.gift_list
      }
    })
  }
  // filter() {
  //   this.sidebarVisible = false
  //   const intDateStart = parseInt(Pf.StringDateToInt(this.dateStart));
  //   const intDateEnd = parseInt(Pf.StringDateToInt(this.dateEnd));

  //   this.acti_service.MOBILE_web_GetSellOutReport(Helper.ProjectID(), intDateStart, intDateEnd, 'result', null).subscribe((result: any) => {
  //     if (result.result == EnumStatus.ok) {
  //       this.ListData = []
  //       this.ListData = result.data.data

  //       console.log(this.ListData );
        
  //     }
  //   })
  // }
  formatDate(date: string | number | Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }
  formatDateDDMMYY(date: string | number | Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('/');
  }
}
