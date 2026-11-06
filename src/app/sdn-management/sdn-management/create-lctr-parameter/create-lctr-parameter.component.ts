import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-lctr-parameter',
  templateUrl: './create-lctr-parameter.component.html',
  styleUrls: ['./create-lctr-parameter.component.scss']
})
export class CreateLctrParameterComponent implements OnInit {
  public addLCTRForm: FormGroup = new FormGroup({});
  public userType: FormControl = new FormControl('', [Validators.required]);
  public amount: FormControl = new FormControl('', [Validators.required]);
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initForm();
  }
  private initForm() {
    this.addLCTRForm.addControl('userType', this.userType);
    this.addLCTRForm.addControl('amount', this.amount);
  }
  onClickSubmit() {
    let req={
      amount:this.amount.value,
      userType:this.userType.value
    }
    this.userService.AddLctr(req).subscribe((data: any) => {
      if (data?.code == 100) {
        alert(data?.message);
      }
      else{
        alert(data?.message);
      }
    })
  }
}
