import { DatePipe } from '@angular/common';
import {
    Component,
    Input,
    SimpleChanges,
    Output,
    EventEmitter,
} from '@angular/core';
import { SelectItemGroup } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { OsaService } from 'src/app/web/service/osa.service';

@Component({
    selector: 'app-control-year-month',
    templateUrl: './control-year-month.component.html',
    styleUrls: ['./control-year-month.component.scss'],
})
export class ControlYearMonthComponent {
    constructor(private _service: OsaService) {}
    isLoadForm = 1;
    selectedYearMonth: any;
    listYearMonth: any = [];
    listYearMonthTest: any = [];

    @Input() placeholder: any = '-- Choose -- ';

    @Output() outValue = new EventEmitter<string>();
    @Input() itemReason!: number;

    returnValue(value: any) {
        this.outValue.emit(value);
    }

    month: any = '';
    getMonth(date: Date, format: string) {
        this.isLoadForm = 1;

        const today = new Date();
        const year = today.getFullYear();
        const yearNext = year + 1;
        const monthToday = today.getMonth() + 1;
        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        for (let month = 1; month <= 12; month++) {
            const monthString = month.toString().padStart(2, '0');
            const yearMonth = `${year} - Tháng ${monthString}`;

            const _date = year + '-' + monthString + '-01';
            const tempDate = new Date(_date);

            const totalDays = new Date(
                tempDate.getFullYear(),
                tempDate.getMonth() + 1,
                0
            ).getDate();

            this.listYearMonth.push({
                name: yearMonth,
                code: `${year}${monthString}`,
            });

            if (month == monthNow - 1) {
                this.isLoadForm = 0;
                this.selectedYearMonth = {
                    name: yearMonth,
                    code: `${year}${monthString}`,
                };
            }

            const monthTest = `Tháng ${monthString}`;
            this.listYearMonthTest.push({
                label: monthTest,
                value: `${year}${monthString}`,
            });
        }

        this.groupedYearMonth.push({
            label: year,
            value: year,
            items: this.listYearMonthTest,
        });

        console.log(
            '🚀 ~ file: control-year-month.component.ts:75 ~ ControlYearMonthComponent ~ getMonth ~ this.groupedYearMonth:',
            this.groupedYearMonth
        );

        const monthString = monthToday.toString().padStart(2, '0');
        this.month = year + monthString;
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        let newDate = new Date();
        this.getMonth(newDate, 'MM');

        // this.loadGroup()
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemReason']) {
            // let newDate = new Date();
            // this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
            // this.getMonth(newDate, 'MM');
        }
    }

    groupedYearMonth: any = [];
    selectedCity: string | undefined;

    loadGroup() {
        this.groupedYearMonth = [
            {
                label: 'Germany',
                value: 'de',
                items: [
                    { label: 'Berlin', value: 'Berlin' },
                    { label: 'Frankfurt', value: 'Frankfurt' },
                    { label: 'Hamburg', value: 'Hamburg' },
                    { label: 'Munich', value: 'Munich' },
                ],
            },
            {
                label: 'USA',
                value: 'us',
                items: [
                    { label: 'Chicago', value: 'Chicago' },
                    { label: 'Los Angeles', value: 'Los Angeles' },
                    { label: 'New York', value: 'New York' },
                    { label: 'San Francisco', value: 'San Francisco' },
                ],
            },
            {
                label: 'Japan',
                value: 'jp',
                items: [
                    { label: 'Kyoto', value: 'Kyoto' },
                    { label: 'Osaka', value: 'Osaka' },
                    { label: 'Tokyo', value: 'Tokyo' },
                    { label: 'Yokohama', value: 'Yokohama' },
                ],
            },
        ];

        this.groupedYearMonth.push({
            label: '2023',
            value: '2023',
            items: [
                { label: 'Berlin', value: 'Berlin' },
                { label: 'Frankfurt', value: 'Frankfurt' },
                { label: 'Hamburg', value: 'Hamburg' },
                { label: 'Munich', value: 'Munich' },
            ],
        });
    }
}
