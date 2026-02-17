import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    // ✅ правильный способ для новых ngx-echarts
    provideEchartsCore({ echarts })
  ]
};
