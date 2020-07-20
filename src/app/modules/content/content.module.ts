import { NgModule } from '@angular/core';
import { InitComponent } from './init/init.component';
import { ContentRoutingModule } from './content-routing';
import { CompartidoModule } from 'src/app/compartido/compartido.module';

@NgModule({
  declarations: [InitComponent],
  imports: [
    ContentRoutingModule,
    CompartidoModule
  ]
})
export class ContentModule { }
