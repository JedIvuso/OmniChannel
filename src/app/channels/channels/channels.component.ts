import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  public modalRef: NgbModalRef;
  basicModalCloseResult: string = '';

  constructor(private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  openAddProjectModel() {
    this.modalRef = this.modalService.open(AddProjectModalComponent, {
      centered: true,
      size: "lg",
    });
    this.modalRef.componentInstance.title = 'Add Project';
  }

  getVideo() {
    this.router.navigate(['channels/training-demos'])
  }
}
