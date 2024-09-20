import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivationService } from 'src/app/web/service/activation.service';
import { Message, MessageService } from 'primeng/api';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
  selector: 'app-gotit-config',
  templateUrl: './gotit-config.component.html',
  styleUrls: ['./gotit-config.component.scss']
})
export class GotitConfigComponent {
  messages: Message[] | undefined;
  openCreateConfig: boolean = true;
  openCreateGotIT: boolean = false;

  constructor(
    private router: Router,
    private _service: ActivationService,
    private messageService: MessageService
  ) { }

  currentDate: any;

  menu_id = 119;
  items_menu: any = [
    { label: 'ACTIVATION ' },
    { label: ' Activation Config & GOTIT Config', icon: 'pi pi-cog' },
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

  checkInventory: any = false;

  id: number = 0;
  project_name!: string;

  authorization: string = '';
  editAuthorization: any;

  prefix: string = '';
  editPrefix: any;

  url: string = '';
  editUrl: any;

  isLoading_Filter: any = false;
  is_loadForm: number = 0;
  first: number = 0;
  totalRecords: number = 0;
  rows: number = 20;
  _pageNumber: number = 1;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
  listConfig: any = [];
  listGotIT: any = [];
  loadData(pageNumber: number) {
    this.is_loadForm = 1;
    if (pageNumber == 1) {
      this.first = 0;
      this.totalRecords = 0;
      this._pageNumber = 1;
    }
    this.isLoading_Filter = true;

    this._service
      .GotIT_config_GetList(
        Helper.ProjectID(),
        this.authorization,
        this.prefix
      )
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.listGotIT = data.data;
            this.prefix = this.listGotIT[0].prefix;
            this.authorization = this.listGotIT[0]["X-GI-Authorization"];
            this.url = this.listGotIT[0].url
          this.totalRecords =
            Helper.IsNull(this.listGotIT) !== true
              ? this.listGotIT.length
              : 0;
          this.isLoading_Filter = false;
        } else {
          this.listGotIT = [];
          this.isLoading_Filter = false;
        }
      });

    this._service
      .activation_config_GetList(
        Helper.ProjectID()
      )
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.listConfig = data.data;
          this.totalRecords =
            Helper.IsNull(this.listConfig) !== true
              ? this.listConfig.length
              : 0;
          this.isLoading_Filter = false;
        } else {
          this.listConfig = [];
          this.isLoading_Filter = false;
        }
      })
  }

  ngOnInit() {
    this.check_permissions();
    this.messages = [
      { severity: 'error', summary: 'Error', detail: 'Error!!!' },
    ];
    this.loadData(1);
  }

  saveNewConfig(event: any) {
    this._service.activation_config_Action(
      Helper.ProjectID(),
      this.checkInventory === false ? 0 : 1,
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.openCreateConfig = false;

        this.loadData(1);
        this.messageService.add({
          severity: 'success',
          summary: 'Action on Activation Config successfully',
          detail: '',
        });
      } else {
        this.openCreateConfig = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }
  saveNewConfigGotit(event: any) {
    this._service.GotIT_config_Action(
      Helper.ProjectID(),
      this.authorization,
      this.prefix,
      this.url
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.openCreateGotIT = false;

        // clear value
        this.prefix = "";
        this.authorization = "";
        this.url = "";

        this.loadData(1);
        this.messageService.add({
          severity: 'success',
          summary: 'Action on GotIT Config successfully',
          detail: '',
        });
      } else {
        this.openCreateGotIT = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }

  showFilter: number = 1;
  ShowHideFilter() {
    if (this.showFilter == 1) {
      this.showFilter = 0;
    } else {
      this.showFilter = 1;
    }
  }
}
