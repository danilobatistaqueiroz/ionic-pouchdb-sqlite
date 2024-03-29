import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
})
export class EmployeePage implements OnInit {
  
  employee:Employee = new Employee();
  canDelete:boolean=false;
  canUpdate:boolean=false;

  constructor(private employeeService: EmployeeService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async addOrUpdate() {
    if (this.canUpdate) {
      this.employeeService.update(this.employee)
    } else {
      this.employeeService.create(this.employee)
    }
    return this.modalCtrl.dismiss(this.employee);
  }

  async removeEmployee() {
    this.employeeService.delete(this.employee);
    return this.modalCtrl.dismiss(this.employee);
  }

}
