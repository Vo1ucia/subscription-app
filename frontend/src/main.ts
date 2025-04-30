import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

bootstrapApplication(HomeComponent, appConfig)
  .catch((err) => console.error(err));
