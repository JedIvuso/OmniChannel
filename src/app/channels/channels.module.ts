import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChannelsComponent } from './channels/channels.component';
import { DemosComponent } from './videos/demos/demos.component';
import { NgbAccordionModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconModule } from '../core/feather-icon/feather-icon.module';
import { VideoModalComponent } from './videos/video-modal/video-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelsComponent
  },
  {
    path: 'training-demos',
    component: DemosComponent
  }
]

@NgModule({
  declarations: [ChannelsComponent, DemosComponent, VideoModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FeatherIconModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbTooltipModule
  ]
})
export class ChannelsModule { }