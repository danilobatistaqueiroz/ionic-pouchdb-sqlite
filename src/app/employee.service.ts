import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription, filter, share } from 'rxjs';
const PouchDB = require('pouchdb').default;
import { Employee } from './employee.model';
import { isMobile } from './system';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public pdb!:any;
  public rdb!:any;
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

  async createPouchDB() {
    this.rdb = new PouchDB('https://192.168.1.27:6984/employees',
    {
      auth: {
        username: "admin",
        password: "123456",
      },
    });
    let options = {adapter:'cordova-sqlite',location:'default',androidDatabaseImplementation:2, key:'123'};
    if(isMobile(this.platform)){
      PouchDB.plugin(require('pouchdb-adapter-cordova-sqlite'));
      this.pdb = new PouchDB('employees.db', options);
    } else {
      this.pdb = new PouchDB('employees.db', {key:'123'});
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

  async localDocs() {
    let docs = await this.pdb.allDocs({ include_docs: true})
    this.employees = docs.rows.map((row:any) => {
      row.doc.Date = new Date(row.doc.Date);
      return row.doc;
    });
    return this.employees;
  }

  async remoteDocs() {
    let docs = await this.rdb.allDocs({ include_docs: true});
    this.employees = docs.rows.map((row:any) => {
      row.doc.Date = new Date(row.doc.Date);
      return row.doc;
    });
    return this.employees;
  }

  async allDocs(connected:string){
    if(connected!="off"){
      return this.localDocs();
    } else {
      return this.remoteDocs();
    }
  }

  async changes(){
    this.pdb.changes({ live: true, since: 'now', include_docs: true}).on('change', async ()=>{
      this.employees = await this.localDocs();
      this.broadcast({name:"updated",employees:this.employees});
    });
  }

  async setAutoSync(){
    this.pdb.sync(this.rdb, {
      live: true,
      retry: true
    }).on('change', function (change:any) {
      console.log(change);
    }).on('error', function (err:any) {
      console.error(err);
    });
  }

  async sync(){
    this.pdb.sync(this.rdb, {
      live: false
    }).on('change', function (change:any) {
      console.log(change);
    }).on('error', function (err:any) {
      console.error(err);
    });
  }


}
