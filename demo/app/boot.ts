import { NgModule, enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { BrowserModule }    from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { NgGridModule } from '../../src';

@NgModule({
  imports: [ BrowserModule, NgGridModule ],
  declarations: [ AppComponent ],
  providers: [],
  bootstrap: [ AppComponent ]
})
class AppModule { }

enableProdMode();
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);