import { ApplicationConfig, importProvidersFrom } from '@angular/core';

import { AppRoutingModule } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//import { TranslateHttpLoader   } from '@ngx-translate/';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { NgChartsConfiguration } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]  )),
        importProvidersFrom(AppRoutingModule
        ), 
    importProvidersFrom(HttpClientModule), 
    importProvidersFrom(    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()]
};
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/xi18n/',".json");
}
