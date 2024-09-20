import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { UserService } from 'src/app/web/service/user.service';
import { SupervisionService } from './service/supervision.service';
import { ActivatedRoute } from '@angular/router';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { DatePipe } from '@angular/common';
import { Pf } from 'src/app/_helpers/pf';

@Component({
  selector: 'app-supervision',
  templateUrl: './supervision.component.html',
  styleUrls: ['./supervision.component.scss']
})
export class SupervisionComponent {
  constructor(
    private activate: ActivatedRoute,
    private userService: UserService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
    public acti_service: ActivationService,
    private _service: SupervisionService
  ) { }

  GetLanguage(key: string) {
    return Helper.GetLanguage(key)
  }
  getLanguage() {
    this.masterService.ewo_GetLanguage(this.project_id).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        localStorage.setItem('key_language', 'vn')
        localStorage.setItem('language', JSON.stringify(data.data))
      }
    })
  }

  start_time: any = null;
  currDate?: any;
  firstDateOfMonth: any;
  lastDateOfMonth: any;
  currentDate: any;
  dateStart: any | undefined;
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  month: any;
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;

    if (month < 10) {
      let x = '0' + month.toString();
      month = +x; 
      +month;
    }
    let day = date.getDate();

    this.currDate = `${year}${month > 9 ? month : "0" + month}${day > 9 ? day : "0" + day}`;
    if (this.month === null || this.month === undefined) {
      this.month = month;
      this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
      this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${Pf.lastDayMonth('', month)}`;
    } else {
      this.firstDateOfMonth = `${year}${month > 9 ? month : "0" + month}01`;
      this.lastDateOfMonth = `${year}${month > 9 ? month : "0" + month}${Pf.lastDayMonth('', +this.month)}`;
    }

    this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  selectMonth: any;
  ListMonth: any = [];
  getMonth(date: Date, format: string) {
    const today = new Date();
    const monthToday = today.getMonth() + 1;
    const year = today.getFullYear();

    const datePipe = new DatePipe('en-US');
    let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
    if (monthNow < 12) {
      monthNow++;
    }
    const dataMonth = Helper.getMonth();
    this.ListMonth = dataMonth.ListMonth;

    const monthString = monthToday.toString().padStart(2, '0');
    const currentDate = parseInt(year + monthString);
    if (Helper.IsNull(this.selectMonth) == true) {
      this.selectMonth = this.ListMonth?.find(
        (i: any) => i?.code == currentDate
      );
    }
  }

  chooseMonthYear() {
    this.month = this.selectMonth.code.toString().slice(4, 6);
    this.totalSales = 0;
    this.getDate();
    this.loadData();
  }

  sumOfSubordinate: any = []
  listSubordinateResult: any = []
  listRawDataSupervision: any = []

  listSellOutEmployee: any = []

  employee_id: any;
  employee_type: any;
  shop_id: any;
  date: any;
  userDecrypt: any
  loginByToken(token: string) {
    localStorage.setItem('theme-config', '{"config":{"ripple":false,"inputStyle":"outlined","menuMode":"overlay","colorScheme":"light","theme":"bootstrap4-light-blue","scale":9},"state":{"staticMenuDesktopInactive":false,"overlayMenuActive":false,"profileSidebarVisible":false,"configSidebarVisible":false,"staticMenuMobileActive":false,"menuHoverActive":false,"theme":false}}')
    this.userService.loginByToken(token)
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          let user_current = data.data;
          const project = user_current.projects.filter(
            (p: any) => p.project_id == Helper.ProjectID()
          );

          if (project.length > 0) {
            const userEncrypt = this._edCrypt.encryptUsingAES256(
              JSON.stringify(user_current.employee[0])
            );
            this.employee_id = user_current.employee[0].employee_id;
            this.employee_type = user_current.employee[0].employee_type_id;
            // console.log(this.employee_id);
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
            this.loadData()
          } else {
            alert('No project decentralization');
          }
        } else {
          alert('Wrong login information');
        }
      }
      );
  }

  totalSales: number = 0;
  loadData() {
    this._service.Mobile_SummarySellOut(
      this.project_id,
      this.selectMonth.code
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        if (this.employee_type === 8) {
          data.data.employee_list.forEach((item: any) => {
            this.totalSales = this.totalSales + item.amount;
          });
          this.listRawDataSupervision = [
            {
              "_key": "admin",
              "name_vn": "Doanh số bán của cả team",
              "icon": "pi pi-money-bill",
              "color": "black",
              "background": "white",
              "Values": `${this.formatAmount(this.totalSales)}`,
              "link": `${Helper.getRouterDomain()}supervision/employee-sellout-list?month=${this.selectMonth.code}&token=${this.token}`
            }
          ]
          this._service.Mobile_Summary_ATD(
            this.selectMonth.code,
            this.project_id
          ).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
              data.data.summary.forEach((element:any) => {
                var item = {
                  "_key": element.code,
                  "name_vn": element.label,
                  "icon": element.icon,
                  "color_title": `rgb(34, 240, 82)`,
                  "color": "black",
                  "background": "white",
                  "Values": element.values,
                  "link": `${Helper.getRouterDomain()}supervision/subordinate-list?month=${this.month}&token=${this.token}`,
                }
                this.listRawDataSupervision.push(item)
              });
            }
          })
        } else {
          data.data.employee_list.forEach((item: any) => {
            this.totalSales = item.amount;
          });
          this.listRawDataSupervision = [
            {
              "_key": "admin",
              "name_vn": "Doanh số bán hàng trong tháng",
              "icon": "pi pi-money-bill",
              "color": "black",
              "background": "white",
              "Values": `${this.formatAmount(this.totalSales)}`,
              "link": `${Helper.getRouterDomain()}supervision/employee-sellout-list?month=${this.selectMonth.code}&token=${this.token}`
            }
          ]
          this._service.Mobile_Summary_ATD(
            this.selectMonth.code,
            this.project_id
          ).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
              data.data.summary.forEach((element:any) => {
                var item = {
                  "_key": element.code,
                  "name_vn": element.label,
                  "icon": element.icon,
                  "color_title": `rgb(34, 240, 82)`,
                  "color": "black",
                  "background": "white",
                  "Values": element.values,
                  "link": `${Helper.getRouterDomain()}supervision/subordinate-list?month=${this.month}&token=${this.token}`,
                }
                this.listRawDataSupervision.push(item)
              });
            }
          })
        }
      }
    })     
  }

  project_id: number = 0
  token: any;
   
  ngOnInit(): void {
    this.getDate();
    let newDate = new Date();
    this.getMonth(newDate, 'MM');
    this.project_id = Helper.ProjectID()
    localStorage.removeItem('_u')
    localStorage.removeItem('user_profile')

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (Helper.getPrams('token', this.activate)) {
      this.token = this.activate.snapshot.queryParamMap.get('token');
      this.loginByToken(Helper.getPrams('token', this.activate));
    }
  }

  formatAmount(amount: number): string {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(2).replace('.', ',') + 'B';
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(2).replace('.', ',') + 'M';
    } else if (amount < 1000000) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'đ';
    } else {
      return amount.toString();
    }
  }
}
