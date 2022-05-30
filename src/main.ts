import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// fix from https://github.com/Azure/azure-sdk-for-js/issues/22003
declare module "@azure/cosmos" {
  interface DedicatedGatewayRequestOptions {}
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
