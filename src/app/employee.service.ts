import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription, filter, share } from 'rxjs';

const PouchDB = require('pouchdb').default;
import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public pdb!:any;
  public employees:Employee[]=[];

  observable: Observable<any>;
  observer!: Observer<any>;

  constructor(public platform: Platform){
    this.observable = Observable.create((observer: Observer<any>) => {
      this.observer = observer;
    }).pipe(share());
  }

  subscribe(eventName:any, callback:any) {
    const subscriber: Subscription = this.observable
    .pipe(
      filter(event => {
        return event.name === eventName;
      })
    )
    .subscribe(callback);
    return subscriber;
  }

  broadcast(event:any) {
    if (this.observer != null) {
      this.observer.next(event);
    }
  }

  destroy(subscriber: Subscription) {
    subscriber.unsubscribe();
  }

  addEmployee(first:string,last:string){
    let employee:Employee = new Employee();
    employee.firstName=first;
    employee.lastName=last;
    this.create(employee);
  }

  isMobile():boolean{
    if(this.platform.platforms().includes('android') || 
       this.platform.platforms().includes('capacitor') || 
       this.platform.platforms().includes('cordova') || 
       this.platform.platforms().includes('mobile') || 
       this.platform.platforms().includes('mobileweb')){
        return true;
    } else {
      return false;
    }
  }

  createPouchDB() {
    if(this.isMobile()){
      PouchDB.plugin(require('pouchdb-adapter-cordova-sqlite'));
      this.pdb = new PouchDB('employees.db',  { adapter: 'cordova-sqlite', 
        location: 'default',
        androidDatabaseImplementation: 2
      });
    } else {
      this.pdb = new PouchDB('employees.db');
    }
  }

  create(employee:any) {
    return this.pdb.post(employee);
  }

  update(employee:any) {
    return this.pdb.put(employee);
  }

  delete(employee:any) {
    return this.pdb.remove(employee);
  }

  async allDocs() {
    let docs = await this.pdb.allDocs({ include_docs: true})
    this.employees = docs.rows.map((row:any) => {
      row.doc.Date = new Date(row.doc.Date);
      return row.doc;
    });
    return this.employees;
  }

  async changes(){
    this.pdb.changes({ live: true, since: 'now', include_docs: true}).on('change', async ()=>{
      this.employees = await this.allDocs();
      this.broadcast({name:"updated",employees:this.employees});
    });
  }

}