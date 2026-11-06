import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-lctr-parameter',
  templateUrl: './list-lctr-parameter.component.html',
  styleUrls: ['./list-lctr-parameter.component.scss']
})
export class ListLctrParameterComponent implements OnInit {
  content: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.listLCTR();
  }
  listLCTR() {
    this.userService.listLCTR().subscribe((data: any) => {
      this.content = data?.lctrParams;
    })
  }
  onClickCreate() {
    this.router.navigateByUrl("aml-sdn-master/create-lctr-parameter");
  }

}
