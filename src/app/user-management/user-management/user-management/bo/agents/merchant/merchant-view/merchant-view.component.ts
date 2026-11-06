import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MiPayAgent, UserManagementService } from '../../../../openapi';
@Component({
  selector: 'app-merchant-view',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor,NgIf],
  templateUrl: './merchant-view.component.html',
  styleUrl: './merchant-view.component.css'
})
export class MerchantViewComponent {

  @Input() backOffice?: MiPayAgent;
  @Output() save = new EventEmitter<MiPayAgent>();
  @Output() cancel = new EventEmitter<void>();
  @Output() saveParentId = new EventEmitter<number>();
  @Input() disableField!:boolean;

  merchantForm: FormGroup;
  userTypes = Object.values(MiPayAgent.UserTypeEnum);
  userTypeConst: any;
  subagents!: MiPayAgent[];
  parentId: any;
  agentName: any;
  isActiveAgentDropDown: boolean = false;

  constructor(private fb: FormBuilder,private location:Location, private boServive:UserManagementService) {
    this.merchantForm = this.fb.group({
      id: [''],
      userType: "AGENT",
      agentType: "MERCHANT",
      accountType: "MERCHANT",
      companyName: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      commissionPercentage: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.boServive.getAllSubAgents().subscribe({
      next:(usrs: any)=>{
        this.subagents = usrs;
      }
    })
    this.setBackOfficeForm();
  }

  onSelectAgent(event: any) {
    this.parentId = event.target.value;
    for(let item of this.subagents){
      if(this.parentId == item?.id){
        // this.agentName = item?.parent.firstName;
        // this.isActiveAgentDropDown = true;
      }
    }
  }
    

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['backOffice'] && changes['backOffice'].currentValue) {
      this.setBackOfficeForm();
    }
  }

  setBackOfficeForm() {
    if (this.backOffice) {
      this.merchantForm.patchValue(this.backOffice);
    }
  }

  onSave() {
    // if (this.merchantForm.valid) {
      if(this.parentId != undefined){
        this.saveParentId.emit(this.parentId);
      }
      // }
      this.save.emit(this.merchantForm.value);
    }

  onCancel() {
    this.cancel.emit();
  }
}