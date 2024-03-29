import { ToastController } from '@ionic/angular';

export class Toast {

  static async presentToast(message:string, color:string) {
    await Toast.presentToastTime(message, color, 2000);
  }

  static async presentToastTime(message:string, color:string, time:number) {
    const toastCtrl = new ToastController();
    const toast = await toastCtrl.create({
      message: message,
      duration: time,
      color: color,
      position: 'top',
      cssClass: 'toastAfterHeader',
      buttons: [
        {
          text: 'close',
          handler: () => {

          }
        }
      ]
    });
    toast.present();
  }
}
