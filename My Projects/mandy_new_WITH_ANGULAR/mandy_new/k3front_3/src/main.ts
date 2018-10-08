import { platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import { AppModule} from './app/app.module';
import { InBetweenModule} from './app/inbetween.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule)
