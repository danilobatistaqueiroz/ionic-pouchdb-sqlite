import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-initial.setup',
  templateUrl: './initial.setup.page.html',
  styleUrls: ['./initial.setup.page.scss'],
})
export class InitialSetupPage implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    const value = (await Preferences.get({ key: 'secret' })).value;
    if(value){
      this.router.navigate(["/home"]);
    }
  }

  secret:string='';
  async crypto(){
    //****** esse secret pode ser usado para critografar campos importantes no PouchDB, infelizmente não tem como criptografar o banco de dados inteiro automaticamente ***/
    await Preferences.set({key:'secret',value:this.secret});
    this.router.navigate(["/home"]);
  }

}
