import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VideoModalComponent } from '../video-modal/video-modal.component';

@Component({
  selector: 'app-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.scss'],
})
export class DemosComponent implements OnInit {
  public modalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  openVideoModal() {
    this.modalRef = this.modalService.open(VideoModalComponent, {
      centered: true,
      size: 'xl',
    });
    this.modalRef.componentInstance.title = 'Record new training';
  }
}
