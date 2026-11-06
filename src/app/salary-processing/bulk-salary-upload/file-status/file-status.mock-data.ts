// file-status.mock-data.ts

import { FileStatus } from "../file-status.model";
import { SalaryFileStatus } from "../salary-file-status.enum";

const makers = [
  { id: 1, username: 'alice' },
  { id: 2, username: 'bob' },
];

const checkers = [
  { id: 3, username: 'charlie' },
  { id: 4, username: 'diana' },
];

export const generateMockFileStatuses = (): FileStatus[] => {
  const fileStatuses: FileStatus[] = [];

  Object.values(SalaryFileStatus).forEach((state, index) => {
    for (let i = 1; i <= 3; i++) {
      const fileStatus: FileStatus = {
        id: index * 10 + i,
        fileName: `file_${"Salary".toLowerCase()}_${i}.csv`,
        status: state,
        maker: makers[i % makers.length],
        checker: checkers[i % checkers.length],
        uploadedTime: new Date(2023, 9, index + i, 10 + i, 0, 0),
        scheduledDate: new Date(2023, 9, index + i + 1),
        approvedDate: new Date(2023, 9, index + i, 15 + i, 0, 0),
      };
      fileStatuses.push(fileStatus);
    }
  });

  return fileStatuses;
};
