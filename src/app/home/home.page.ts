import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ModalController } from '@ionic/angular';
import { EmployeePage } from '../employee/employee.page';
import { Employee } from '../employee.model';
import { Toast } from '../toast';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  firstName:string='';
  lastName:string='';
  connected:string='';

  public employees: Employee[] = [];

  constructor(public modalCtrl: ModalController, public employeeService : EmployeeService) {}

  async ngOnInit() {
    this.connectionDetection();
    this.employeeService.createPouchDB();
    this.employeeService.changes();
    //this.employeeService.setSync();
    this.resync();
    await this.employeeService.allDocs(this.connected);
    this.employees = this.employeeService.employees;
    this.employeeService.subscribe("updated",(evt:any)=> {
      this.employees = evt.employees;
    });
  }

  oldStatus:string="unknown";
  async connectionDetection(){
    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      if(status.connected==false){
        this.connected="off";
      } else {
        this.connected=status.connectionType; //pode ser cellular, wifi, unknown, none
        if(this.connected=="none" || this.connected=="unknown"){
          this.connected="off";
        }
      }
      if(this.oldStatus=="off" && this.connected!="off"){
        this.connRestablished();
      }
      this.oldStatus = this.connected;
    });
  }

  idRestablished:any;
  connRestablished(){
    clearTimeout(this.idRestablished);
    this.idRestablished = setTimeout(()=>{
      this.employeeService.sync();
    }, 10000);
  }

  resync(){
    setInterval(()=>{
      if(this.connected!="off"){
        this.employeeService.sync();
      }
    }, 120000);
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
