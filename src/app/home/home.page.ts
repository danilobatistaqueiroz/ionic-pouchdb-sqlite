import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ModalController } from '@ionic/angular';
import { EmployeePage } from '../employee/employee.page';
import { Employee } from '../employee.model';
import { Toast } from '../toast';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  firstName:string='';
  lastName:string='';

  public employees: Employee[] = [];

  constructor(public modalCtrl: ModalController, public employeeService : EmployeeService) {}

  async ngOnInit() {
    this.employeeService.createPouchDB();
    this.employeeService.changes();
    await this.employeeService.allDocs();
    this.employees = this.employeeService.employees;
    this.employeeService.subscribe("updated",(evt:any)=> {
      this.employees = evt.employees;
    });
  }

  async showDetails(employee:any) {
    const modal = await this.modalCtrl.create({
      component: EmployeePage,
      componentProps: {employee:employee}
    });
    modal.onDidDismiss().then(() => {
    });
    await modal.present();
  }

  addEmployee(){
    this.employeeService.addEmployee(this.firstName,this.lastName);
    this.firstName='';
    this.lastName='';
    Toast.presentToast(`employee adicionado`, 'success');
  }

}
