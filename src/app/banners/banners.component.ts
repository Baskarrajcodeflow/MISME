import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BannerService } from './banner.service';
import { LoaderComponent } from "../loader/loader.component";
import { KycModuleService } from '../kyc/kyc/kyc-module.service';
import { environment } from '../../environments/environment';

interface CreateBannerRequest {
  name: string,
  startDate: string,
  endDate: string,
  priority: number,
}

interface EditBannerRequest {
  id: number,
  name?: string,
  active?: boolean,
  startDate?: string,
  endDate?: string,
  priority?: number,
}

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoaderComponent],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.css'
})
export class BannersComponent {
  isLoading : boolean = false
  bannerId: number = 0;
  title: string = '';
  startDateTime: string = '';
  endDateTime: string = '';
  priority: number = 1;
  isActive: boolean = true;
  bannerFile: File | null = null;
  bannerList: any[] = [];
  activeTab : 'BannerList' | 'CreateBanner' = 'BannerList';
  isEdit : boolean = false;
  selectedBannerId: number | null = null;
  priorities!: number[];

  constructor(private bannerService: BannerService,    private KycService: KycModuleService,
  ) {}


  ngOnInit() {
    this.getAllBanners();
  }
 

   onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.bannerFile = file;
    }
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  save() {
    alert('Save button clicked');
   /*  this.isLoading = true; */
   console.log("isEdit",this.isEdit);

    if(!this.isEdit){
    let createPayload : CreateBannerRequest = {
      name: this.title,
      startDate: this.startDateTime,
      endDate: this.endDateTime,
      priority: this.priority
    };
    this.bannerService.createBanner(createPayload).subscribe(response => {
      this.isLoading = false;
      console.log('Banner created successfully:', response);
      this.bannerId = response?.data?.id; // Assuming the response contains the created banner ID
      this.uploadBanner();
    }, error => {
       this.isLoading = false;
      console.error('Error creating banner:', error);
    });
  }
  else{
    let editPayload: EditBannerRequest = {
      id: this.selectedBannerId!,
      name: this.title,
      active: this.isActive,
      startDate: this.startDateTime,
      endDate: this.endDateTime,
      priority: this.priority
    };
    this.bannerService.editBanner(editPayload).subscribe({
      next: (response) => {
         this.isLoading = false;
        console.log('Banner edited successfully:', response);
        if(this.bannerFile) {
          this.uploadBanner();
        }
        else{
          alert('Banner Edited Successfully');
          this.getAllBanners();
          this.isEdit = false;
          this.isLoading = false;
          this.activeTab = 'BannerList';
        }
      },
      error: (error) => {
        alert('Error, Try again later');
        this.isLoading = false;
        console.error('Error editing banner:', error);
      }
    });
  }
    
  }

  uploadBanner() {
    if (this.bannerFile) {
      this.bannerService.uploadBanner(this.bannerId,this.bannerFile).subscribe(response => {
        if(response?.responseCode == 200 ){
          console.log('Banner uploaded successfully:', response);
          if(this.isActive){
            let editPayload: EditBannerRequest = {
              id: this.bannerId,
             // name: this.title,
              active: this.isActive,
             // startDate: this.startDateTime,
             // endDate: this.endDateTime,
             // priority: this.priority
            };
            this.bannerService.editBanner(editPayload).subscribe({
              next: (editResponse) => {
                console.log('Banner Activated successfully:', editResponse);
              },
              error: (editError) => {
                console.error('Error editing banner:', editError);
              }
            });
          }

        }
      }, error => {
        console.error('Error uploading banner:', error);
      });
    }
  }

  getAllBanners() {
    this.isLoading = true;
    this.bannerService.getBanners().subscribe(response => {
      if(response?.responseCode == 200) {
        this.bannerList = response?.data || [];
        this.priorities = Array.from({length: this.bannerList.length}, (_, i) => i + 1);
        this.bannerList.forEach(banner => {
          banner.startDateModified = this.convertToCustomDateFormat(banner.startDate);
          banner.endDateModified = this.convertToCustomDateFormat(banner.endDate);
          console.log('Banners fetched successfully:', this.bannerList);
          
        });
        
      } else {

        console.error('Error fetching banners:', response);
        return;
      }
      /* console.log('Banners fetched successfully:', response); */
    }, error => {
      console.error('Error fetching banners:', error);
    });
     this.isLoading = false;
  }

  tabChange(tab?: 'BannerList' | 'CreateBanner') {
  }

  toggleState(bannerItem : any) {
    this.isLoading = true;
    let editPayload: EditBannerRequest = {
      id: bannerItem.id,
      active: !bannerItem.active
    };
    this.bannerService.editBanner(editPayload).subscribe({
      next: (response) => {
         this.isLoading = false;
        console.log('Banner state toggled successfully:', response);
        this.getAllBanners(); // Refresh the banner list after toggling state
      },
      error: (error) => {
         this.isLoading = false;
         alert('Error, Try again later');
        console.error('Error toggling banner state:', error);
      }
      
    }
  );
  
  }
  removeBanner(bannerItem : any) {
    this.isLoading = true;
    this.bannerService.deleteBanner(bannerItem.id).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Banner Removed Succesfully');
        console.log('Banner deleted successfully:', response);
        this.getAllBanners(); // Refresh the banner list after deletion
      },
      error: (error) => {
        this.isLoading = false;
        alert('Error, Try again later');
        console.error('Error deleting banner:', error);
      }
    });
  }

  editBanner(bannerItem: any) {
    this.isEdit = true;
    this.selectedBannerId = bannerItem.id;
    this.title = bannerItem.name;
    this.startDateTime = bannerItem.startDate;
    this.endDateTime = bannerItem.endDate;
    this.priority = bannerItem.priority;
    this.isActive = bannerItem.active;
    this.activeTab = 'CreateBanner';
  }
  convertToCustomDateFormat(dateString: string): string {
  const date = new Date(dateString);

  const day = ('0' + date.getDate()).slice(-2); // ensures 2 digits
  const month = date.toLocaleString('en-US', { month: 'long' }); // "June"
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = ('0' + date.getMinutes()).slice(-2); // ensures 2 digits
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  const formattedTime = `${('0' + hours).slice(-2)}:${minutes} ${ampm}`;

  return `${day} ${month} ${year} ${formattedTime}`;
}
viewBanner(fileName: string) {
  
     this.bannerService.viewBanner(fileName);
  }

} 
