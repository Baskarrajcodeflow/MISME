import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-risk-tier',
  templateUrl: './list-risk-tier.component.html',
  styleUrls: ['./list-risk-tier.component.scss']
})
export class ListRiskTierComponent implements OnInit {
  content: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.listRiskParameter();
  }
  listRiskParameter() {
    this.userService.listRiskTier().subscribe((data: any) => {
      this.content = data?.riskTierParams;
    })
  }
  onClickCreate() {
    this.router.navigateByUrl("aml-sdn-master/create-risk-tier");
  }
}
