import { CommonModule } from '@angular/common';

import { Component, OnDestroy } from '@angular/core';

import {

  FormBuilder,

  FormGroup,

  FormsModule,

  ReactiveFormsModule,

  Validators,

} from '@angular/forms';

import { Subscription } from 'rxjs';

import { CrmServiceService } from '../crm-service.service';

import * as XLSX from 'xlsx';



interface User {

  id: number | string;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  walletNumber: string;

  userType: string;

  selected?: boolean;

}



type SearchMeta = 'PHONE' | 'EMAIL' | 'WALLET';



type NotificationChannel = 'SMS' | 'EMAIL' | 'FCM';



type UploadFormat = 'CSV' | 'XLSX' | 'JSON';



interface BulkNotificationRow {

  name: string;

  emailAddress: string;

  phoneNumber: string;

  walletNumber: string;

  messageContent: string;

  channelType: string;

  [key: string]: any;

}



interface BulkRowError {

  rowNumber: number;

  name: string;

  errors: string[];

}





@Component({

  selector: 'app-manual-notification',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    ReactiveFormsModule,

  ],

  templateUrl: './manual-notification.component.html',

  styleUrl: './manual-notification.component.css',

})

export class ManualNotificationComponent implements OnDestroy {



  // ============================================================

  // Page / bulk upload state

  // ============================================================



  activePage: 'manual' | 'upload' = 'manual';

  uploadFormat: UploadFormat = 'CSV';

  selectedUploadFile: File | null = null;

  isProcessingFile = false;

  uploadError = '';

  uploadResultTab: 'errors' | 'uploaded' = 'errors';

  uploadedRows: BulkNotificationRow[] = [];

  uploadRowErrors: BulkRowError[] = [];

  readonly maxUploadSize = 140 * 1024;





  // ============================================================

  // Forms

  // ============================================================



  searchForm: FormGroup;

  notificationForm: FormGroup;



  // ============================================================

  // Users

  // ============================================================



  users: User[] = [];



  selectAll = false;



  // ============================================================

  // Loading

  // ============================================================



  isSearching = false;

  isSending = false;



  // ============================================================

  // Search

  // ============================================================



  searchMeta: SearchMeta = 'PHONE';



  // ============================================================

  // Notification

  // ============================================================



  selectedChannels: NotificationChannel[] = [];



  smsMaxLength = 160;

  pushMaxLength = 500;

  emailSubjectMaxLength = 150;

  emailBodyMaxLength = 5000;



  // ============================================================

  // Error / Message

  // ============================================================



  searchError = '';

  sendError = '';



  private subscriptions = new Subscription();

  hasProcessedUpload: boolean = false;
  isSendingBulkNotification: boolean = false;


  constructor(

    private fb: FormBuilder,

    private crmService: CrmServiceService

  ) {



    // ==========================================================

    // Search Form

    // ==========================================================



    this.searchForm = this.fb.group({

      searchMeta: ['PHONE', Validators.required],



      keyword: [

        '',

        [

          Validators.required,

        ],

      ],

    });



    // ==========================================================

    // Notification Form

    // ==========================================================



    this.notificationForm = this.fb.group({



      subject: [

        '',

        [

          Validators.maxLength(

            this.emailSubjectMaxLength

          ),

        ],

      ],



      content: [

        '',

        [

          Validators.required,

        ],

      ],

    });



    // ==========================================================

    // Search Type Change

    // ==========================================================



    this.subscriptions.add(

      this.searchForm

        .get('searchMeta')

        ?.valueChanges

        .subscribe((value: SearchMeta) => {



          this.searchMeta = value;



          // Clear previous search value

          this.searchForm.patchValue(

            {

              keyword: '',

            },

            {

              emitEvent: false,

            }

          );



          // Clear previous search results

          this.users = [];

          this.selectAll = false;

          this.searchError = '';



          // Update validators based on search type

          this.updateSearchValidators();

        })

    );



    // ==========================================================

    // Initial notification validators

    // ==========================================================



    this.updateNotificationValidators();

  }



  // ============================================================

  // Search API

  // ============================================================



  searchUsers(): void {



    this.searchError = '';



    // Trim keyword

    const keyword =

      this.searchForm.get('keyword')?.value?.trim() || '';



    this.searchForm.patchValue(

      {

        keyword,

      },

      {

        emitEvent: false,

      }

    );



    // Validate form

    if (this.searchForm.invalid) {



      this.searchForm.markAllAsTouched();



      return;

    }



    const searchMeta: SearchMeta =

      this.searchForm.get('searchMeta')?.value;



    // ==========================================================

    // API Request

    // ==========================================================



    const payload = {

      keyword,

      searchMeta,

    };



    console.log(

      'Manual notification search request:',

      payload

    );



    this.isSearching = true;



    // Clear old selection/results before new search

    this.users = [];

    this.selectAll = false;



    /*

     * API:

     *

     * POST /crm/notification/search

     *

     * Request:

     *

     * {

     *   keyword: '9876543210',

     *   searchMeta: 'PHONE'

     * }

     */



    this.subscriptions.add(

      this.crmService.notification(payload).subscribe({

        next: (response: any) => {



          console.log(

            'Manual notification search response:',

            response

          );



          this.users = this.mapUsers(response);



          this.selectAll = false;

          this.isSearching = false;



        },



        error: (error) => {



          console.error(

            'Manual notification search failed:',

            error

          );



          this.users = [];

          this.selectAll = false;

          this.isSearching = false;



          this.searchError =

            error?.error?.message ||

            error?.message ||

            'Unable to search users. Please try again.';

        },

      })

    );

  }



  // ============================================================

  // Map API Response

  // ============================================================



  private mapUsers(response: any): User[] {



    let responseData: any = response;



    if (response?.data?.content) {

      responseData = response.data.content;

    } else if (response?.data) {

      responseData = response.data;

    } else if (response?.content) {

      responseData = response.content;

    } else if (response?.users) {

      responseData = response.users;

    }



    if (!Array.isArray(responseData)) {

      return [];

    }



    return responseData.map((item: any) => ({

      id:

        item.id ??

        item.userId ??

        item.customerId ??

        '',



      firstName:

        item.firstName ??

        item.first_name ??

        item.first ??

        '',



      lastName:

        item.lastName ??

        item.last_name ??

        item.last ??

        '',



      email:

        item.email ??

        '',



      phone:

        item.phone ??

        item.mobile ??

        item.phoneNumber ??

        '',



      walletNumber:

        item.walletNumber ??

        item.wallet ??

        '',



      userType:

        item.userType ??

        item.type ??

        '',



      selected: false,

    }));

  }



  // ============================================================

  // Search Validators

  // ============================================================



  private updateSearchValidators(): void {



    const keywordControl =

      this.searchForm.get('keyword');



    keywordControl?.clearValidators();



    keywordControl?.setValidators([

      Validators.required,

    ]);



    keywordControl?.updateValueAndValidity();

  }



  // ============================================================

  // Reset Search

  // ============================================================



  resetSearch(): void {



    this.searchForm.reset({

      searchMeta: 'PHONE',

      keyword: '',

    });



    this.searchMeta = 'PHONE';



    this.users = [];



    this.selectAll = false;



    this.searchError = '';

  }



  // ============================================================

  // Select All

  // ============================================================



  toggleSelectAll(): void {



    this.users.forEach((user) => {

      user.selected = this.selectAll;

    });

  }



  // ============================================================

  // Individual Selection

  // ============================================================



  toggleUserSelection(): void {



    this.selectAll =

      this.users.length > 0 &&

      this.users.every((user) => user.selected);

  }



  // ============================================================

  // Selected Users

  // ============================================================



  get selectedUsers(): User[] {



    return this.users.filter(

      (user) => user.selected

    );

  }



  get selectedUserCount(): number {



    return this.selectedUsers.length;

  }



  // ============================================================

  // Notification Channel Selection

  // ============================================================



  toggleChannel(

    channel: NotificationChannel

  ): void {



    const index =

      this.selectedChannels.indexOf(channel);



    if (index > -1) {



      // Remove channel

      this.selectedChannels.splice(index, 1);



    } else {



      // Add channel

      this.selectedChannels.push(channel);

    }



    this.updateNotificationValidators();



    this.sendError = '';

  }



  // ============================================================

  // Channel Selection Helpers

  // ============================================================



  isChannelSelected(

    channel: NotificationChannel

  ): boolean {



    return this.selectedChannels.includes(channel);

  }



  get hasEmailChannel(): boolean {



    return this.isChannelSelected('EMAIL');

  }



  get hasSmsChannel(): boolean {



    return this.isChannelSelected('SMS');

  }



  get hasPushChannel(): boolean {



    return this.isChannelSelected('FCM');

  }



  // ============================================================

  // Notification Validators

  // ============================================================



  private updateNotificationValidators(): void {



    const subject =

      this.notificationForm.get('subject');



    const content =

      this.notificationForm.get('content');



    // ==========================================================

    // Subject

    // ==========================================================



    subject?.clearValidators();



    if (this.hasEmailChannel) {



      subject?.setValidators([

        Validators.required,

        Validators.maxLength(

          this.emailSubjectMaxLength

        ),

      ]);



    } else {



      subject?.setValidators([

        Validators.maxLength(

          this.emailSubjectMaxLength

        ),

      ]);

    }



    // ==========================================================

    // Content

    // ==========================================================



    content?.clearValidators();



    const contentValidators = [

      Validators.required,

    ];



    if (this.hasSmsChannel) {



      contentValidators.push(

        Validators.maxLength(this.smsMaxLength)

      );



    } else if (this.hasPushChannel) {



      contentValidators.push(

        Validators.maxLength(this.pushMaxLength)

      );



    } else {



      contentValidators.push(

        Validators.maxLength(this.emailBodyMaxLength)

      );

    }



    content?.setValidators(contentValidators);



    subject?.updateValueAndValidity();

    content?.updateValueAndValidity();

  }



  // ============================================================

  // Content Character Count

  // ============================================================



  get contentLength(): number {



    return (

      this.notificationForm

        .get('content')

        ?.value?.length || 0

    );

  }



  // ============================================================

  // Content Maximum Length

  // ============================================================



  get contentMaxLength(): number {



    /*

     * When multiple channels are selected, use

     * the largest applicable limit.

     *

     * SMS  = 160

     * PUSH = 500

     * EMAIL = 5000

     */



    if (this.hasEmailChannel) {

      return this.emailBodyMaxLength;

    }



    if (this.hasPushChannel) {

      return this.pushMaxLength;

    }



    return this.smsMaxLength;

  }



  // ============================================================

  // Send Notification

  // ============================================================



  sendNotification(): void {



    this.sendError = '';



    // ==========================================================

    // Check users

    // ==========================================================



    if (this.selectedUsers.length === 0) {



      this.sendError =

        'Please select at least one user.';



      return;

    }



    // ==========================================================

    // Check notification channel

    // ==========================================================



    if (this.selectedChannels.length === 0) {



      this.sendError =

        'Please select at least one notification type.';



      return;

    }



    // ==========================================================

    // Validate form

    // ==========================================================



    this.notificationForm.markAllAsTouched();



    if (this.notificationForm.invalid) {

      return;

    }



    const formValue =

      this.notificationForm.value;



    // ==========================================================

    // User IDs

    // ==========================================================



    const userIds =

      this.selectedUsers

        .map((user) => String(user.id))

        .filter((id) => id.trim() !== '')

        .join(',');



    // ==========================================================

    // Email addresses

    // ==========================================================



    const email =

      this.hasEmailChannel

        ? this.selectedUsers

          .map((user) => user.email?.trim() || '')

          .filter((email) => email !== '')

          .join(',')

        : null;



    // ==========================================================

    // Phone numbers

    // ==========================================================



    const phone =

      this.hasSmsChannel

        ? this.selectedUsers

          .map((user) => user.phone?.trim() || '')

          .filter((phone) => phone !== '')

          .join(',')

        : null;



    // ==========================================================

    // Subject

    // ==========================================================



    const subject =

      this.hasEmailChannel

        ? formValue.subject?.trim() || null

        : null;



    // ==========================================================

    // Content

    // ==========================================================



    const content =

      formValue.content?.trim() || '';



    // ==========================================================

    // Final API Payload

    // ==========================================================



    const payload = {

      channels: [...this.selectedChannels],



      subject,



      content,



      userIds,



      email,



      phone,

    };



    console.log(

      'Manual notification request:',

      payload

    );



    /*

     * API:

     *

     * POST /crm/notification/manual

     *

     * Example:

     *

     * {

     *   "channels": ["EMAIL", "SMS", "FCM"],

     *   "subject": "Important Notification",

     *   "content": "Your message here",

     *   "userIds": "101,102,103",

     *   "email": "a@gmail.com,b@gmail.com",

     *   "phone": "9876543210,9876543211"

     * }

     *

     * Send API is not connected yet.

     */



    this.isSending = true;



    // TODO:

    this.crmService.manualNotification(payload).subscribe((data: any) => {





      setTimeout(() => {



        this.isSending = false;



      }, 500);

    })



  }



  // ============================================================

  // Bulk upload page navigation

  // ============================================================



  setActivePage(page: 'manual' | 'upload'): void {

    this.activePage = page;

  }



  onUploadFormatChange(fileInput?: HTMLInputElement): void {

    this.resetBulkUpload(fileInput);

  }



  onUploadFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0] || null;

    this.setSelectedUploadFile(file);

  }



  onUploadFileDrop(event: DragEvent): void {

    event.preventDefault();

    const file = event.dataTransfer?.files?.[0] || null;

    this.setSelectedUploadFile(file);

  }



  allowUploadDrop(event: DragEvent): void {

    event.preventDefault();

  }



  private setSelectedUploadFile(file: File | null): void {
    // Every new selection starts a completely new upload session.
    this.clearBulkUploadResults();
    this.uploadError = '';

    if (!file) {
      this.selectedUploadFile = null;
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const expectedExtension: Record<UploadFormat, string> = {
      CSV: 'csv',
      XLSX: 'xlsx',
      JSON: 'json',
    };

    if (extension !== expectedExtension[this.uploadFormat]) {
      this.selectedUploadFile = null;
      this.uploadError = `Please select a .${expectedExtension[this.uploadFormat]} file.`;
      return;
    }

    if (file.size > this.maxUploadSize) {
      this.selectedUploadFile = null;
      this.uploadError = 'File size must not exceed 140 KB.';
      return;
    }

    this.selectedUploadFile = file;

    // Process immediately after selecting/dropping the file.
    // There is intentionally no separate Submit step.
    this.processUploadFile();
  }

  processUploadFile(): void {
    if (!this.selectedUploadFile) {
      this.uploadError = 'Please select a file first.';
      return;
    }

    this.uploadError = '';
    this.uploadedRows = [];
    this.uploadRowErrors = [];
    this.hasProcessedUpload = false;
    this.uploadResultTab = 'errors';
    this.isProcessingFile = true;

    const file = this.selectedUploadFile;

    if (this.uploadFormat === 'XLSX') {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const workbook = XLSX.read(reader.result, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];

          if (!firstSheetName) {
            throw new Error('The Excel file does not contain a worksheet.');
          }

          const firstSheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' }) as any[];
          this.validateBulkRows(rows);
        } catch (error: any) {
          this.finishUploadWithError(
            error?.message || 'Unable to read this Excel file. Please check the file format.',
          );
        }
      };

      reader.onerror = () => {
        this.finishUploadWithError('Unable to read the selected file.');
      };

      reader.readAsArrayBuffer(file);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const content = String(reader.result || '');
        const rows = this.uploadFormat === 'CSV'
          ? this.parseCsv(content)
          : this.parseJson(content);

        this.validateBulkRows(rows);
      } catch (error: any) {
        this.finishUploadWithError(
          error?.message || 'Unable to read the selected file.',
        );
      }
    };

    reader.onerror = () => {
      this.finishUploadWithError('Unable to read the selected file.');
    };

    reader.readAsText(file);
  }

  private finishUploadWithError(message: string): void {
    this.uploadError = message;
    this.uploadedRows = [];
    this.uploadRowErrors = [];
    this.isProcessingFile = false;
    this.hasProcessedUpload = true;
    this.uploadResultTab = 'errors';
  }

  // Native CSV parser: supports quoted values and commas inside quotes.
  private parseCsv(content: string): any[] {
    const lines: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if (char === '"' && inQuotes && content[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(cell.trim());
        cell = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && content[i + 1] === '\n') i++;
        row.push(cell.trim());
        if (row.some((value) => value !== '')) lines.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }

    row.push(cell.trim());
    if (row.some((value) => value !== '')) lines.push(row);

    if (lines.length < 2) {
      throw new Error('The CSV file is empty or has no data rows.');
    }

    const headers = lines[0].map((value) => value.replace(/^\uFEFF/, '').trim());

    return lines.slice(1).map((values) => {
      const item: Record<string, any> = {};
      headers.forEach((header, index) => {
        item[header] = values[index] ?? '';
      });
      return item;
    });
  }

  private parseJson(content: string): any[] {
    const parsed = JSON.parse(content);
    const rows = Array.isArray(parsed) ? parsed : parsed?.data;

    if (!Array.isArray(rows)) {
      throw new Error('JSON must contain an array of records, or an object with a data array.');
    }

    return rows;
  }

  private normalizeUploadKey(value: string): string {
    return String(value ?? '').replace(/^\uFEFF/, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // private validateBulkRows(sourceRows: any[]): void {
  //   this.uploadedRows = [];
  //   this.uploadRowErrors = [];
  //   this.uploadError = '';

  //   if (!sourceRows.length) {
  //     this.finishUploadWithError('The selected file does not contain any data rows.');
  //     return;
  //   }

  //   const requiredColumns = [
  //     'name',
  //     'emailaddress',
  //     'phonenumber',
  //     'walletnumber',
  //     'messagecontent',
  //     'channeltype',
  //   ];

  //   const firstRowKeys = Object.keys(sourceRows[0] || {}).map((key) =>
  //     this.normalizeUploadKey(key),
  //   );
  //   const missingColumns = requiredColumns.filter((column) => !firstRowKeys.includes(column));

  //   if (missingColumns.length) {
  //     this.finishUploadWithError(`Missing columns: ${missingColumns.join(', ')}.`);
  //     return;
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phonePattern = /^\d{9}$/;
  //   const walletPattern = /^\d{13}$/;
  //   const validChannels = ['SMS', 'EMAIL', 'FCM'];
    
    

  //   sourceRows.forEach((source: any, index: number) => {
  //     const values: Record<string, any> = {};

  //     Object.keys(source || {}).forEach((key) => {
  //       values[this.normalizeUploadKey(key)] = source[key];
  //     });

  //     const item: BulkNotificationRow = {
  //       name: String(values['name'] ?? '').trim(),
  //       emailAddress: String(values['emailaddress'] ?? '').trim(),
  //       phoneNumber: String(values['phonenumber'] ?? '').trim(),
  //       walletNumber: String(values['walletnumber'] ?? '').trim(),
  //       messageContent: String(values['messagecontent'] ?? '').trim(),
  //       channelType: String(values['channeltype'] ?? '').trim().toUpperCase(),
  //     };

  //     const rowErrors: string[] = [];

  //     if (!item.name) rowErrors.push('Name is required.');

  //     if (!item.emailAddress) {
  //       rowErrors.push('Email Address is required.');
  //     } else if (!emailPattern.test(item.emailAddress)) {
  //       rowErrors.push('Please enter a valid email address.');
  //     }

  //     if (!item.phoneNumber) {
  //       rowErrors.push('Phone Number is required.');
  //     } else if (!phonePattern.test(item.phoneNumber)) {
  //       rowErrors.push('Phone Number must contain exactly 9 digits.');
  //     }

  //     if (!item.walletNumber) {
  //       rowErrors.push('Wallet Number is required.');
  //     } else if (!walletPattern.test(item.walletNumber)) {
  //       rowErrors.push('Wallet Number must contain exactly 13 digits.');
  //     }

  //     if (!item.messageContent) rowErrors.push('Message Content is required.');

  //     if (!item.channelType) {
  //       rowErrors.push('Channel Type is required.');
  //     } else if (!validChannels.includes(item.channelType)) {
  //       rowErrors.push('Channel Type must be SMS, EMAIL or FCM.');
  //     }

  //     // Keep every source row in the table, including invalid rows.
  //     this.uploadedRows.push(item);

  //     if (rowErrors.length) {
  //       this.uploadRowErrors.push({
  //         rowNumber: index + 2,
  //         name: item.name || '-',
  //         errors: rowErrors,
  //       });
  //     }
  //   });

  //   this.uploadResultTab = this.uploadRowErrors.length ? 'errors' : 'uploaded';
  //   this.isProcessingFile = false;
  //   this.hasProcessedUpload = true;
  // }
  
private validateBulkRows(sourceRows: any[]): void {
  this.uploadedRows = [];
  this.uploadRowErrors = [];
  this.uploadError = '';

  if (!sourceRows.length) {
    this.finishUploadWithError(
      'The selected file does not contain any data rows.'
    );
    return;
  }

  const requiredColumns = [
    'name',
    'emailaddress',
    'phonenumber',
    'walletnumber',
    'messagecontent',
    'channeltype',
  ];

  const firstRowKeys = Object.keys(sourceRows[0] || {}).map((key) =>
    this.normalizeUploadKey(key)
  );

  const missingColumns = requiredColumns.filter(
    (column) => !firstRowKeys.includes(column)
  );

  if (missingColumns.length) {
    this.finishUploadWithError(
      `Missing columns: ${missingColumns.join(', ')}.`
    );
    return;
  }

  // Field validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{9}$/;
  const walletPattern = /^\d{13}$/;

  // Allowed notification channels
  const validChannels = ['SMS', 'EMAIL', 'FCM'];

  // Validate each Excel row
  sourceRows.forEach((source: any, index: number) => {
    const values: Record<string, any> = {};

    Object.keys(source || {}).forEach((key) => {
      values[this.normalizeUploadKey(key)] = source[key];
    });

    // Prepare row data
    const item: BulkNotificationRow = {
      name: String(values['name'] ?? '').trim(),
      emailAddress: String(values['emailaddress'] ?? '').trim(),
      phoneNumber: String(values['phonenumber'] ?? '').trim(),
      walletNumber: String(values['walletnumber'] ?? '').trim(),
      messageContent: String(values['messagecontent'] ?? '').trim(),
      channelType: String(values['channeltype'] ?? '').trim().toUpperCase(),
    };

    // Store validation errors for this row
    const rowErrors: string[] = [];

    // Name validation
    if (!item.name) {
      rowErrors.push('Name is required.');
    }

    // Email validation
    if (!item.emailAddress) {
      rowErrors.push('Email Address is required.');
    } else if (!emailPattern.test(item.emailAddress)) {
      rowErrors.push('Please enter a valid email address.');
    }

    // Phone validation
    if (!item.phoneNumber) {
      rowErrors.push('Phone Number is required.');
    } else if (!phonePattern.test(item.phoneNumber)) {
      rowErrors.push('Phone Number must contain exactly 9 digits.');
    }

    // Wallet validation
    if (!item.walletNumber) {
      rowErrors.push('Wallet Number is required.');
    } else if (!walletPattern.test(item.walletNumber)) {
      rowErrors.push('Wallet Number must contain exactly 13 digits.');
    }

    // Message validation
    if (!item.messageContent) {
      rowErrors.push('Message Content is required.');
    }

    // ------------------------------------
    // Channel Type validation
    // ------------------------------------

    const channels = item.channelType
      .split(',')
      .map((channel: string) => channel.trim().toUpperCase());

    if (!item.channelType || channels.every((channel) => !channel)) {
      rowErrors.push('Channel Type is required.');
    } else {
      // Check for empty values, e.g. SMS,,FCM
      if (channels.some((channel) => !channel)) {
        rowErrors.push(
          'Channel Type contains an empty value. Use comma-separated values such as EMAIL,FCM.'
        );
      }

      // Remove empty values before checking allowed channels
      const nonEmptyChannels = channels.filter(
        (channel: string) => channel.length > 0
      );

      // Check unsupported channels
      const invalidChannels = nonEmptyChannels.filter(
        (channel: string) => !validChannels.includes(channel)
      );

      if (invalidChannels.length > 0) {
        rowErrors.push(
          `Invalid Channel Type: ${invalidChannels.join(', ')}. Allowed values: SMS, EMAIL, FCM.`
        );
      }

      // Check duplicate channels
      if (
        new Set(nonEmptyChannels).size !== nonEmptyChannels.length
      ) {
        rowErrors.push('Duplicate channel types are not allowed.');
      }
    }

    // ------------------------------------
    // End of Channel Type validation
    // ------------------------------------

    // Keep every source row in the uploaded data table
    this.uploadedRows.push(item);

    // Store errors against the corresponding Excel row
    if (rowErrors.length > 0) {
      this.uploadRowErrors.push({
        rowNumber: index + 2,
        name: item.name || '-',
        errors: rowErrors,
      });
    }
  });

  // Show the appropriate tab
  this.uploadResultTab =
    this.uploadRowErrors.length > 0 ? 'errors' : 'uploaded';

  this.isProcessingFile = false;
  this.hasProcessedUpload = true;
}


  get isUploadValid(): boolean {
    return this.hasProcessedUpload &&
      !this.isProcessingFile &&
      !this.uploadError &&
      this.uploadedRows.length > 0 &&
      this.uploadRowErrors.length === 0;
  }

  isUploadRowInvalid(rowIndex: number): boolean {
    const sourceRowNumber = rowIndex + 2;
    return this.uploadRowErrors.some((error) => error.rowNumber === sourceRowNumber);
  }

  private clearBulkUploadResults(): void {
    this.uploadedRows = [];
    this.uploadRowErrors = [];
    this.hasProcessedUpload = false;
    this.uploadResultTab = 'errors';
    this.isProcessingFile = false;
    this.isSendingBulkNotification = false;
  }

  resetBulkUpload(fileInput?: HTMLInputElement): void {
    this.selectedUploadFile = null;
    this.clearBulkUploadResults();
    this.uploadError = '';

    // Clear the native input so the same file can be selected again.
    if (fileInput) fileInput.value = '';
  }

  sendNotificationByFileUpload(): void {
    // Guard the API method as well as disabling the button in the template.
    if (!this.selectedUploadFile || !this.isUploadValid || this.isSendingBulkNotification) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedUploadFile);
    this.isSendingBulkNotification = true;

    this.crmService.sendNotification(formData).subscribe({
      next: (data: any) => {
        this.isSendingBulkNotification = false;
        console.log(data);

        if (data?.responseCode === 200 && data?.data?.validRows > 0) {
          alert('Notification sent successfully');
        } else {
          const errorMessages = data?.data?.results
            ?.map((item: any) => `Row ${item.rowNumber - 1}: ${item.message}`)
            .join('\n');
          alert(errorMessages || data?.error || 'Something went wrong');
        }
      },
      error: (error: any) => {
        this.isSendingBulkNotification = false;
        alert(error?.error?.message || error?.message || 'Unable to send notifications. Please try again.');
      },
    });
  }

  // ============================================================

  // Destroy

  // ============================================================

  ngOnDestroy(): void {



    this.subscriptions.unsubscribe();

  }

}
