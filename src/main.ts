import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { SharedService } from './app/services/SharedService';

if (environment.production) {
  enableProdMode();
}

// Bootstrap the AppModule
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((moduleRef) => {
    const sharedService = moduleRef.injector.get(SharedService);
  })
  .catch(err => console.error(err));
