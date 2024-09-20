import { Component } from '@angular/core';
import { ActivationService } from 'src/app/web/service/activation.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { UserService } from 'src/app/web/service/user.service';
import { SupervisionService } from '../service/supervision.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Helper } from 'src/app/Core/_helper';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-subordinate-list',
  templateUrl: './subordinate-list.component.html',
  styleUrls: ['./subordinate-list.component.scss'],
})
export class SubordinateListComponent {
  constructor(
    private router: Router,
    private activate: ActivatedRoute,
    private userService: UserService,
    private _edCrypt: EncryptDecryptService,
    private masterService: MastersService,
    public acti_service: ActivationService,
    private _service: SupervisionService,
  ) { }

  isLoadForm = 1;
  inputStyle: any = { minWidth: '100%', maxWidth: '100%' };
  selectShop: any;
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

  listDataEmployee: any = [] // danh sách nhân viên đã chấm công
  listDataSubordinate: any = [] // danh sách nhân viên chưa chấm công

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

  start_time: any = null;
  currDate?: any;
  firstDateOfMonth: any;
  currentDate: any;
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  month: any;
  getDate() {
    let date = new Date();
    let year = date.getFullYear();
    // let month = date.getMonth() + 1;
    let day = date.getDate();

    this.currDate = `${year}${this.month}${day > 9 ? day : "0" + day}`;
    this.firstDateOfMonth = `${year}${this.month}01`;
    this.currentDate = Helper.convertDateStr1(this.currDate);
  }

  listShop: any;
  listShops: any = [];
  selectedListShop(e: any) {
    this.listShop = e.value === null ? 0 : e.value.shop_id;
  }

  openTasks(event: any, itemRaw: any) {
    let taskMap = new Map();
    itemRaw.forEach((item: any) => {
      if (!taskMap.has(item.atd_date)) {
        taskMap.set(item.atd_date, {
          title: Helper.convertDateStr1(item.atd_date),
          day: item.atd_date,
          date: []
        });
      }
      let task = taskMap.get(item.atd_date);
      task.date.push({
        employee_id: item.employee_id,
        areas: item.areas,
        atd_date: item.atd_date,
        atd_date_converted: Helper.convertDateStr1(item.atd_date),
        atd_photo_ci: item.atd_photo_ci,
        atd_photo_co: item.atd_photo_co,
        atd_time_ci: item?.atd_time_ci,
        atd_time_co: item.atd_time_co,
        note: item.note,
        second_time: item.second_time,
        shift_code: item.shift_code,
        shift_id: item.shift_id,
        shop_code: item.shop_code,
        shop_id: item.shop_id,
        shop_name: item.shop_name
      });

      this.listDataEmployee.map((element: any) => {
        if (element.employee_id === item.employee_id) {
          element.tasks = Array.from(taskMap.values());
        }
      })
    })

    // this.listDataEmployee = this.listDataEmployee.map((item: any) => {
    //   if (item.employee_id === itemRaw.employee_id) {
    //     item.tasks = Array.from(taskMap.values());
    //   }
    // })
    // this.listDataEmployee.tasks = Array.from(taskMap.values());

    this.listDataEmployee.forEach((item: any) => {
      item.tasks.sort(Helper.compareValuesArrObjAsc('day'));
    })
    // console.log(this.listDataEmployee);
  }
  CheckImage(image:any){
    if(image == "" || image == null || image == undefined)
      return "https://icons.iconarchive.com/icons/hopstarter/soft-scraps/128/User-Coat-Green-icon.png"
    else
    return image
  }

  isLoading_Filter: any = false;
  loadData() {
    this.isLoading_Filter = true;

    // console.log(Helper.transformDateInt(this.start_time) === 19700101 ? this.firstDateOfMonth : Helper.transformDateInt(this.start_time));
    // console.log(Helper.transformDateInt(this.start_time) === 19700101 ? this.currDate : Helper.transformDateInt(this.start_time));

    this._service.MOBILE_web_Timekeeping_ListEmployee_JSE(
      this.project_id,
      // 20240821,
      // 20240821
      Helper.transformDateInt(this.start_time) === 19700101 ? this.firstDateOfMonth : Helper.transformDateInt(this.start_time),
      Helper.transformDateInt(this.start_time) === 19700101 ? this.currDate : Helper.transformDateInt(this.start_time)
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.isLoadForm = 0;
        let mainData = data.data.data_result;

        let employeeMap = new Map();
        mainData.forEach((item: any) => {
          if (!employeeMap.has(item.employee_id)) {
            employeeMap.set(item.employee_id, {
              employee_id: item.employee_id,
              employee_name: item.employee_name,
              email: item.email,
              image: item.image,
              mobile: item.mobile,
              atd_date: item.atd_date,
              time_ci: item?.time_ci,
              time_co: item?.time_co,
              tasks: []
            });
          }

          let employee = employeeMap.get(item.employee_id);
          employee.tasks.push({
            employee_id: item.employee_id,
            areas: item.areas,
            atd_date: item.atd_date,
            atd_photo_ci: item.atd_photo_ci,
            atd_photo_co: item.atd_photo_co,
            atd_time_ci: item?.atd_time_ci,
            time_ci: item?.time_ci,
            atd_time_co: item?.atd_time_co,
            time_co: item?.time_co,
            note: item.note,
            second_time: item.second_time,
            shift_code: item.shift_code,
            shift_id: item.shift_id,
            shop_code: item.shop_code,
            shop_id: item.shop_id,
            shop_name: item.shop_name
          });
        });

        this.listDataEmployee = Array.from(employeeMap.values());

        let listShop: { shop_id: any; shop_name: any; shop_code: any; }[] = [];
        mainData.forEach((item: any) => {
          listShop.push({
            shop_id: item.shop_id,
            shop_name: item.shop_name,
            shop_code: item.shop_code
          })
        })

        this.listShops = listShop;
        // console.log(this.listShops);

        this.isLoading_Filter = false;
      }
    });
  }

  // routeToWorkDayDetail(event: any) {
  //   this.router.navigate([`http://localhost:4200/supervision/workday-detail?token=${this.token}`]);
  // }

  project_id: number = 0
  token: any;
  link: any;
  employee_id_route: any;
  ngOnInit(): void {


    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (Helper.getPrams('token', this.activate)) {
      this.token = this.activate.snapshot.queryParamMap.get('token');
      this.month = this.activate.snapshot.queryParamMap.get('month');
      this.loginByToken(Helper.getPrams('token', this.activate));
    }

    this.isLoadForm = 1;
    this.getDate();
    this.project_id = Helper.ProjectID();
    localStorage.removeItem('_u');
    localStorage.removeItem('user_profile');
  }

  urlGallery: any;
  showImageProduct(url: any) {
    this.urlGallery = url;
    document.open(
      <string>this.urlGallery,
      'image_default',
      'height=700,width=900,top=100,left= 539.647'
    );
  }

  routeToWorkdayDetail(rawData: any) {
    this.employee_id_route = rawData.employee_id;
    this.link = `${Helper.getRouterDomain()}/supervision/monthly-timesheet?month=${this.month}$employee_id=${this.employee_id_route}&token=${this.token}`
  }

  turnBack(event: any) {
    this.link = `${Helper.getRouterDomain()}/supervision?token=${this.token}`;
    // window.history.back();
  }
}
