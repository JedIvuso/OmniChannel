import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddProjectModalComponent } from './add-project-modal/add-project-modal.component';
import { HttpService } from 'src/app/shared/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  public modalRef: NgbModalRef;
  basicModalCloseResult: string = '';
  itemsForPresentation: any[];
  public channelId:any;

  constructor(private router: Router, private modalService: NgbModal, private _httpService: HttpService) { }

  ngOnInit(): void {
    this.getChannelData();
  }

  getChannelData() {
    this._httpService.omniGet("/channel-category/list-channels").subscribe(
      (resp: any) => {
        if(resp.respCode == "00"){
          let response = resp.channels.map((item: any) => {
            const res = {...item};
            return res;
          });
          this.itemsForPresentation = response;
        }
        else {
          Swal.fire('Failed', "Unable to fetch channels", 'error')
        }
      }, (error: any) => {
        Swal.fire("Error", error.message, "error");
      });
  }

  openAddChannelModal() {
    this.modalRef = this.modalService.open(AddProjectModalComponent, {
      centered: true,
      size: "lg",
    });
    this.modalRef.componentInstance.title = 'Add Channel';
  }

  openEditChannelModal(formData: any){
    this.modalRef = this.modalService.open(AddProjectModalComponent, {
      centered: true,
      size: "lg",
    });
    this.modalRef.componentInstance.title = 'Edit Channel';
    this.modalRef.componentInstance.channelId = this.channelId;
    this.modalRef.componentInstance.formData = formData;
    this.modalRef.result.then((result) => {
      if (result === 'Channel updated successfully') {
        this.getChannelData();
      } else {
        console.log("Error occurred")
      }
    });
  }

  getVideo() {
    this.router.navigate(['channels/training-demos'])
  }
}
