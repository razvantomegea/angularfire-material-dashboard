import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { LearnDetailsComponent } from './learn-details/learn-details.component';
import { LearnRoutingModule } from './learn-routing.module';
import { LearnComponent } from './learn.component';

@NgModule({
  imports: [
    MarkdownModule.forRoot({ loader: HttpClient }),
    SharedModule,
    LearnRoutingModule
  ],
  declarations: [LearnComponent, LearnDetailsComponent]
})
export class LearnModule {
}
