import { Component, ElementRef, ViewChild } from '@angular/core';
import WebViewer from '@pdftron/webviewer'

@Component({
  selector: 'app-pdf-form',
  standalone: true,
  imports: [],
  templateUrl: './pdf-form.component.html',
  styleUrl: './pdf-form.component.css'
})
export class PdfFormComponent {
    @ViewChild('viewer') viewerRef!: ElementRef;
  
    constructor() { }
  
    ngAfterViewInit(): void {
      WebViewer({
        path: '../lib', // path to the PDFTron 'lib' folder on your server
        initialDoc: '../assets/Customer.pdf',
      }, this.viewerRef.nativeElement).then(instance => {
        const  docViewer  = instance;
        // You can now interact with the PDF here
        // docViewer.on('documentLoaded', () => {
        //   console.log('Document is loaded and ready for interaction!');
        // });
      });
    } 
}
