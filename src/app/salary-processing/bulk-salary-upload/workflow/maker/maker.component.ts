import { Component, signal } from '@angular/core';
import { CorpChooserComponent } from '../../corp-chooser/corp-chooser.component';
import { CsvUploadComponent } from '../../csv-upload/csv-upload.component';
import { CsvValidationReportComponent } from '../../csv-validation-report/csv-validation-report.component';
import { SchedulerComponent } from '../../scheduler/scheduler.component';
import { MakerCreate } from './maker.model';
import { Corp } from '../../corp-chooser/corp-chooser.model';
import { NgIf } from '@angular/common';
import { ValidateFileComponent } from "../../validate-file/validate-file.component";
import { DataSharingService } from '../../../../product/dataSharing/data-sharing.service';

@Component({
  selector: 'app-maker',
  standalone: true,
  imports: [
    NgIf,
    CorpChooserComponent,
    CsvUploadComponent,
    CsvValidationReportComponent,
    SchedulerComponent,
    ValidateFileComponent
],
  templateUrl: './maker.component.html',
  styleUrl: './maker.component.css'
  })

  export class MakerComponent {
  showFiles: any;
  disable:boolean = true
    constructor(private data:DataSharingService){
      data?.setFlagForNewUpload$.subscribe((res=>{
        if(res == false){
          this.disable = res
        }
      }))
      data?.reuploadFileData$.subscribe((res)=>{
        this.showFiles = res
      })
 
    }
    onValidationEvent(event: string) {
    if(event==='GET_ANALYSIS_REPORT'){
      this.makerCreate.fileAnalysed.set(true)
    } 
    if(event === 'SCHEDULE'){
      this.makerCreate.fileAnalysed.set(true)
    }
  }
  makerCreate: MakerCreate = {
    selectedCorp: signal<Corp | null>(null),
    fileUploaded: signal(false),
    fileValidated: signal(false),
    fileAnalysed: signal(false),
    fileScheduled: signal(false)
  };
  onCorporateSelected(corporate: Corp) {
    console.log("--------------------");
      this.makerCreate.selectedCorp.set(corporate);
  }

  onFileUploaded(x: boolean){
    this.makerCreate.fileUploaded.set(x)
  }

  onReUpload() {
    // this.makerCreate.selectedCorp.set(null);
    this.data.setFlagData(true)
    this.data.setFlagForNewUploadData(true)
    this.showFiles = false    

    // Set boolean values
    // this.makerCreate.fileUploaded.set(true);
    // this.makerCreate.fileValidated.set(true);
    // this.makerCreate.fileAnalysed.set(false);
    // this.makerCreate.fileScheduled.set(false);
  }

  onReSchedule() {
    this.makerCreate.fileScheduled.set(true);
  }

  onClose() {
    throw new Error('Method not implemented.');
  }

  onNewFileUpload() {
    this.data.setFlagData(false)
this.showFiles = false    
    this.makerCreate.selectedCorp.set(null);
    // this.onReUpload();
  }
  handleScheduled(event: { date: string, time: string }) {
    console.log('Scheduled date and time:', event);
    // Handle scheduling logic here
  }

  handleUploadNewFile() {
    console.log('Upload New File button clicked');
    // Handle file upload logic here
  }

  handleClose() {
    console.log('Close button clicked');
    // Handle close logic here
  }

  handleActivate() {
    console.log('Activate button clicked');
    // Handle activation logic here
  }
}
 
function WritableSignal<T>(arg0: null): import("@angular/core").Signal<Corp> {
  throw new Error('Function not implemented.');
}
