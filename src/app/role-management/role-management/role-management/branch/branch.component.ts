import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from './branch.service';
import { FormsModule, } from '@angular/forms';
import { Branch, BranchControllerServiceService } from '../openapi';
import { LoaderComponent } from '../../../../loader/loader.component';
import { NgFor, NgIf } from '@angular/common';
import { showToast } from '../../../../core/toast/toast';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [FormsModule,LoaderComponent,NgIf,NgFor],
  providers:[BranchService],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent {
  branchId: number | undefined;
  branchName!: string ;
  description: string | undefined;
  branch: any;
  branchRequest!: Branch;
  isLoading: boolean = false;
  @Output() branchCreated = new EventEmitter<boolean>();

  constructor(
    private route: ActivatedRoute,
    private branchService: BranchControllerServiceService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.branchId = this.route.snapshot.params['id'];
    // this.branchService.getBranchByName(this.branchName!).subscribe({
    //   next: (branch: { name: string; }) => this.branchName = branch.name,
    //   error: (err: any) => console.error('Failed to load branch', err)
    // });
  }

  updateBranch(): void {
    // this.branchService.updateBranch({ id: this.branchId, name: this.branchName }).subscribe({
    //   next: () => this.router.navigate(['/branches']),
    //   error: (err: any) => console.error('Failed to update branch', err)
    // });
  }
  
  onSubmit(){
     this.isLoading = true;
    this.branchRequest = {
      name: this.branchName
    }
    this.branchService.createBranch(this.branchRequest).subscribe({
        next: (branch:any) => {
          if(branch){
            showToast("created successfully");
            this.branchCreated.emit(true);
            this.branchName = '';
            this.isLoading = false;
          }
          else{
            showToast("Something went wrong");
            this.isLoading = false;
          }
          // this.branch = this.branch.filter(o => o.id !== a.id);
          // this.branch.push(branch);
        },
        error: (error) => {
        showToast("Something went wrong");
        this.isLoading = false;
      }
      })
  }
}
