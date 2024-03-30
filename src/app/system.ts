import { Platform } from '@ionic/angular';

export function isMobile(platform:Platform):boolean{
  if(platform.platforms().includes('android') || 
     platform.platforms().includes('capacitor') || 
     platform.platforms().includes('cordova') || 
     platform.platforms().includes('mobile') || 
     platform.platforms().includes('mobileweb')){
      return true;
  } else {
    return false;
  }
}