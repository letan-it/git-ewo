import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'src/app/web/service/reports.service';

@Component({
    selector: 'app-publish-image',
    templateUrl: './publish-image.component.html',
    styleUrls: ['./publish-image.component.scss'],
})
export class PublishImageComponent {
    constructor(
        private route: ActivatedRoute,
        private serviceReport: ReportsService
    ) {}
    responsiveOptions: any[] = [
        {
            breakpoint: '1500px',
            numVisible: 5,
        },
        {
            breakpoint: '1024px',
            numVisible: 3,
        },
        {
            breakpoint: '768px',
            numVisible: 2,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];
    images: any;
    data_url: any;
    displayCustom: boolean = false;

    activeIndex: number = 0;
    imageClick(item: any) {
        this.activeIndex = item.row_number - 1;
        this.displayCustom = true;
    }
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        console.log(
            '🚀 ~ file: publish-image.component.ts:16 ~ PublishImageComponent ~ ngOnInit ~ id:',
            id
        );
        this.serviceReport.ewo_GetImageAll(id + '').subscribe((data: any) => {
            this.images = data.data;
            //this.openImage(this.images[0])
        });
        // this.responsiveOptions = [
        //     {
        //         breakpoint: '1024px',
        //         numVisible: 5,
        //     },
        //     {
        //         breakpoint: '768px',
        //         numVisible: 3,
        //     },
        //     {
        //         breakpoint: '560px',
        //         numVisible: 1,
        //     },
        // ];
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }
    currentPhoto: any;
    GetImagePhoto(item: any) {
        this.currentPhoto = item;
    }
    urlgallery: any;
    openImage(item: any) {
        const listphoto = this.images.map((item: any) => ({
            id: item.row_number,
            src: item.src,
            title: item.alt,
            image_time: item.image_time,
            _index: item.row_number,
        }));

        const changeindex = item.row_number;
        localStorage.setItem('listphoto', JSON.stringify(listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=0,left= 50'
        );
    }
}
