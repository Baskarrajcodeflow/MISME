import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-risk-parameter',
  templateUrl: './list-risk-parameter.component.html',
  styleUrls: ['./list-risk-parameter.component.scss']
})
export class ListRiskParameterComponent implements OnInit {
  content: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.listRiskParameter();
  }
  listRiskParameter() {
    this.userService.listRiskParameter().subscribe((data: any) => {
      this.content = data?.riskParams;
    })
  }
  onClickCreate() {
    this.router.navigateByUrl("aml-sdn-master/create-risk-parameter");
  }
}
