import { SalaryFileStatus } from "./salary-file-status.enum";

// file-status.model.ts
export interface FileStatus {
    id: number;
    fileName: string;
    status: SalaryFileStatus;
    maker: BaseUser;
    checker: BaseUser;
    uploadedTime: Date;
    scheduledDate: Date;
    approvedDate: Date;
  }
  
  // base-user.model.ts
  export interface BaseUser {
    id: number;
    username: string;
    // Add other relevant user fields
  }
  