import { Component } from '@angular/core';
import { UserManagementService } from '../user-management.service';
import { TableColumn, TableRow } from '../../../../interface/interface-list';
import { TableComponent } from '../../../../table/table.component';



@Component({
  selector: 'app-corporate',
  standalone: true,
  imports: [],
  templateUrl: './corporate.component.html',
  styleUrl: './corporate.component.css'
})
export class CorporateComponent {

  users:any;
  userType = "corporate"
  constructor(private userService:UserManagementService){}

  tableCol : TableColumn[] = [
    {field : 'Id', header:'ID', sortable: true},
    {field : 'firstName', header:'First Name'},
    {field : 'lastName', header:'Last Name'},
    {field : 'phone', header:'Phone'},
    {field : 'email', header:'Email'},
    {field : 'role', header:'Role'},
    {field : 'active', header:'Active'},

  ];

  tableRow : TableRow[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    // this.userService.getAllUsers().subscribe( resp => {
      // this.users = resp.data;
      console.log(this.users,"this.users");
      
     this.users = [
      {Id : '1',  firstName : 'AFN',  lastName: '100',phone:'677878888888' , email : '150', role : '250',  active : 'true'},
      {Id : '2',  firstName : 'USD',  lastName: '200',phone:'677878888888',  email : '100', role : '350' , active : 'false'},
      {Id : '3',  firstName : 'AFN1',  lastName: '100',phone:'677878888888' , email : '150', role : '250',  active : 'true'},
      {Id : '4',  firstName : 'USD1',  lastName: '200',phone:'677878888888',  email : '100', role : '350' , active : 'false'},

     ]
    //  this.tableRow = this.users.map((user:any) => ({
    //   Id: user.Id,
    //   firstName : user.firstName,
    //   lastName : user.lastName,
    //   phone : user.phone,
    //   email: user.email,
    //   role: user.role,
    //   active: user.active
    // }));
    // })
  }
  activateSelectedUsers(userIds: number[]): void {
    const req = { userIds };
    this.userService.activateAdminUser(req).subscribe(
      resp => {
        console.log('Users activated', resp);
        this.getUsers(); // Refresh the list after activation
      },
      error => {
        console.error('Error activating users', error);
      }
    );
  }

  deActivateSelectedUsers(userIds: number[]): void {
    const req = { userIds };
    this.userService.deActivateAdminUser(req).subscribe(
      resp => {
        console.log('Users deactivated', resp);
        this.getUsers(); // Refresh the list after deactivation
      },
      error => {
        console.error('Error deactivating users', error);
      }
    );
  }

  deleteUsers(userIds: number[]): void {
    const req = { userIds };
    this.userService.deleteUser(req).subscribe(
      resp => {
        console.log('Users activated', resp);
        this.getUsers(); // Refresh the list after activation
      },
      error => {
        console.error('Error activating users', error);
      }
    );
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