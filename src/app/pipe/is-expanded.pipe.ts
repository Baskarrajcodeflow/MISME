import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isExpanded'
})
export class IsExpandedPipe implements PipeTransform {
  transform(branchId: number | null, expandedBranchId: number | null): boolean {
    console.log("In pipe ", branchId === expandedBranchId)
    return branchId === expandedBranchId;
  }
}