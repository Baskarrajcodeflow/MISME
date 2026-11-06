import { Component, Input } from '@angular/core';
import { TableComponent } from "../../table/table.component";
import { TableColumn, TableRow } from '../../interface/interface-list';
import { BackOffice, UserManagementService } from '../openapi';

@Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
    imports: [TableComponent]
})
export class UserComponent {
  backOfficeUsers!: BackOffice[];
  selectedUsers!:  BackOffice;
  userType = "user";
  tableRow : TableRow[] = [];

  constructor(private boUserService: UserManagementService ){}

  tableCol : TableColumn[] = [
    {field : 'id', header:'ID', sortable: true},
    {field : 'firstName', header:'First Name'},
    {field : 'lastName', header:'Last Name'},
    {field : 'phone', header:'Phone'},
    {field : 'email', header:'Email'},
    {field : 'username', header:'User Name'},
    {field : 'userType', header:'User Type'},
    {field : 'role', header:'Role'},
    {field : 'active', header:'Active'},
  ];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.boUserService.getAllBackOffice().subscribe({
      next: (value:BackOffice[]) => {
        this.backOfficeUsers = value;
        console.log("hi");
        console.log(this.backOfficeUsers,"this.users");
      }
    })
  }

  activateSelectedUsers(userIds: number[]): void {
    // const selectedUsers = { userIds };`
    // this.boUserService.reActivate('').subscribe({
    //   next: (value: ) => {
    //     console.log('Users activated', value);
    //     this.getUsers();
    //   }
    // })
  }

  deActivateSelectedUsers(userIds: number[]): void {
    // const req = { userIds };
    // this.userService.deActivateAdminUser(req).subscribe({
    //   next: (value: JSON) => {
    //     console.log('Users deactivated',value);
    //     this.getUsers();
    //   }
    // })
  }

  deleteUsers(userIds: number[]): void {
    // const req = { userIds };
    // this.userService.deleteUser(req).subscribe({
    //   next: (value: JSON) => {
    //     console.log('Users activated', value);
    //     this.getUsers();
    //   }
    // })
  }

  onActivateUsers(userIds: number[]): void {
    this.activateSelectedUsers(userIds);
  }

  onDeactivateUsers(userIds: number[]): void {
    this.deActivateSelectedUsers(userIds);
  }
  
  onDeleteUserUsers(userIds: number[]): void {
    this.deleteUsers(userIds);
 }
}
