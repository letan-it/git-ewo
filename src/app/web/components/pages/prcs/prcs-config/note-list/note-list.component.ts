import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { PrcsService } from '../../service/prcs.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent {
  messages: Message[] | undefined;

  openNewTakeNote: boolean = false;
  openEditTakeNote: boolean = false;

  constructor(
    private router: Router,
    private _service: PrcsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  currentDate: any;

  menu_id = 101;
  items_menu: any = [
    { label: 'PROCESS ' },
    { label: ' Config', icon: 'pi pi-cog', routerLink: '/prcs/config' },
    { label: ' Config Note List', icon: 'pi pi-file-edit' },
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

  note: any = "";
  // selectedCategory(event: any) {}
  Id: any;
  editProjectId: any;
  editProcessId: any;
  editNote: any;

  filterProcess: any;
  filterProcesses: any = [];
  editInfoProcess: any;
  selectedFilterProcess(e: any) {
    this.filterProcess = e.value === null ? 0 : e.value.process_id;
  }

  is_edit: boolean = false;
  filterIsEdit: any = -1;
  editIsEdit: any;
  filterIsEdits: any = [
    { name: 'Active', value: 1, icon: 'pi pi-check-circle' },
    { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' },
  ];
  editIsEdits: any = [
    { name: 'Active', value: 1, icon: 'pi pi-check-circle' },
    { name: 'Inactive', value: 0, icon: 'pi pi-times-circle' },
  ];
  selectedFilterIsEdits(e: any) {
    this.filterIsEdit = e.value === null ? -1 : e.value;
  }
  selectedEditIsEdit(e: any) {
    this.editIsEdit = e.value === null ? -1 : e.value;
  }
  clearFilterStatus() {
    this.is_edit = false;
  }
  
  notificationContent: any = "";
  noteContent: any = "";
  editNoteContent: any;

  // filterNoteContent: any;
  // filterNoteContents: any = [];
  // selectedFilterNoteContents(e: any) {
  //   this.filterNoteContent = e.value === null ? 0 : e.value.note;
  //   if (this.filterNoteContent === "Khác: ") {
  //     this.is_edit = 1;
  //   } else {
  //     this.is_edit = 0;
  //   }
  // }

  ngOnInit() {
    this.check_permissions();
    this.messages = [
      { severity: 'error', summary: 'Error', detail: 'Error!!!' },
    ];
    this.loadProcess();
    this.loadData(1);
  }

  loadProcess() {
    this._service
      .PrcGetMaster(Helper.ProjectID())
      .subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          data.data.process_list.forEach((element: any) => {
            this.filterProcesses.push({
              process_id: element.process_id,
              process_name: element.process_name,
              type_process: element.type_process,
            });
          });
        }
      }
    );
  }

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
  listNote: any = [];
  loadData(pageNumber: number) {
    this.is_loadForm = 1;
    if (pageNumber == 1) {
      this.first = 0;
      this.totalRecords = 0;
      this._pageNumber = 1;
    }
    this.isLoading_Filter = true;

    this._service.PrcGetNoteList(
        Helper.ProjectID(),
        this.filterProcess,
        this.note,
        this.filterIsEdit.value === undefined
          ? -1
          : this.filterIsEdit.value
      ).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.listNote = [];
          data.data.note_list.forEach((element: any) => {
            this.listNote.push({
              ...element,
              process_id: element.process_id,
              process_name: element.process_name
            })
          });
          // console.log(this.listNote);
          this.totalRecords =
            Helper.IsNull(this.listNote) !== true
              ? this.listNote.length
              : 0;
          this.isLoading_Filter = false;
        } else {
          this.listNote = [];
          this.isLoading_Filter = false;
        }
      }
    );
  }

  openNew() {
    this.openNewTakeNote = true;
  }
  saveNoteContent(event: any) {
    if (this.filterProcess === 0 && this.noteContent === "") {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please complete all information!',
        detail: '',
      });
    } else if (this.filterProcess === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please choose Process!',
        detail: '',
      });
    } else if (this.noteContent === "") {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please fill in Note content!',
        detail: '',
      });
    } else {
      // console.log(this.is_edit);
      this._service.PrcNoteListAction(
        0,
        Helper.ProjectID(),
        this.filterProcess,
        this.noteContent,
        // this.is_edit === -1 ? 0 : 1,
        this.is_edit === false ? 0 : 1,
        'create'
      ).subscribe((data: any) => {
        if (data.result == EnumStatus.ok) {
          this.openNewTakeNote = false;
          this.noteContent = undefined;
          this.filterProcess = undefined;
          this.is_edit = false;
          this.loadData(1);
          this.messageService.add({
            severity: 'success',
            summary: 'Take new Note successfully',
            detail: '',
          });
        } else {
          this.openNewTakeNote = false;
          this.messageService.add({
            severity: 'danger',
            summary: 'Error',
            detail: '',
          });
        }
      })
    }
  }

  openEdit(item_raw: any) {
    this.openEditTakeNote = true;

    this.Id = item_raw.id;
    this.editProjectId = item_raw.project_id;
    this.editProcessId = item_raw.process_id;
    this.editInfoProcess = this.filterProcesses?.find((item: any) => {
      return item.process_id === this.editProcessId
        ? JSON.stringify(item.process_name)
        : '';
    });
    this.editNoteContent = item_raw.note;
    this.editIsEdit = item_raw.is_edit === 1 ? true : false;
    // console.log(this.editIsEdit);
  }
  editNoteList(event: any) {
    this._service.PrcNoteListAction(
      this.Id,
      this.editProjectId,
      this.editProcessId,
      this.editNote = this.editNoteContent === null ? this.editNote : this.editNoteContent,
      // this.editIsEdit === 0 || this.editIsEdit === 1
      //     ? this.editIsEdit
      //     : this.editIsEdit.value,
      this.editIsEdit === false ? 0 : 1,
      "update"
    ).subscribe((data: any) => {
      if (data.result == EnumStatus.ok) {
        this.openEditTakeNote = false;
        this.loadData(1);
        this.messageService.add({
          severity: 'success',
          summary: 'Update Notification Template successfully',
          detail: '',
        });
      } else {
        this.openEditTakeNote = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Error',
          detail: '',
        });
      }
    })
  }
  openDelete(item_raw: any, event: any) {
    let id = item_raw.id;
    let projectId = item_raw.project_id;
    let processId = item_raw.process_id;
    let note = item_raw.note;
    let isEdit = item_raw.is_edit;
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete it?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._service.PrcNoteListAction(
          id,
          projectId,
          processId,
          note,
          isEdit,
          "delete"
        ).subscribe((data: any) => {
          if (data.result == EnumStatus.ok) {
            this.loadData(1);
            this.messageService.add({
              severity: 'success',
              summary: 'Delete Note successfully',
              detail: '',
            });
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
      },
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
}
