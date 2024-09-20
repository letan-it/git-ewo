import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/web/service/product.service';
import { SmartBoothService } from '../service/smartbooth.service';

@Component({
    selector: 'app-smart-booth',
    templateUrl: './smart-booth.component.html',
    styleUrls: ['./smart-booth.component.scss'],
    providers: [MessageService],
})
export class SmartBoothComponent {
    constructor(
        private messageService: MessageService,
      private productService: ProductService,
        private service: SmartBoothService
    ) {}
    report: any  
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.  loadData() 
      const data = this.getListOfMonths()
      
      console.log(data);
      
    }
    loadData() {
      this.service.web_GetFakeData().subscribe((data:any) => {
        this.report = data.data.report
        
      })
    }
    private formatYearMonth(year: number, month: number): string {
      return `${year}${month.toString().padStart(2, '0')}`;
    }
    private getMonthName(month: number): string {
      const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ];
      return monthNames[month - 1];
    }
    getListOfMonths(): any[] {
      const currentDate = new Date();
      const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
      const list_year = [];
  
      for (let date = new Date('2023-08-01'); date <= endMonth; date.setMonth(date.getMonth() + 1)) {
        const yearMonth = this.formatYearMonth(date.getFullYear(), date.getMonth() + 1);
        const monthName = this.getMonthName(date.getMonth() + 1);
        const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
        const monthObject = {
          name: `${monthName} - ${date.getFullYear()}`,
          month: yearMonth,
          code: yearMonth,
          totalday: totalDays
        };
  
        list_year.push(monthObject);
      }
      return list_year;
    }
    copyText(item: any, content: any) {
        let val = 'Code: ' + item + '\n' + content;
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
        this.messageService.add({
            severity: 'success',
            summary: 'copy text successfully',
            detail: val,
        });
    }
}
