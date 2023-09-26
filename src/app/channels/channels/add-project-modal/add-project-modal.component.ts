import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'src/app/shared/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})
export class AddProjectModalComponent implements OnInit {
  @Input() formData: any;
  addChannelForm: FormGroup;
  errorMsg: string;
  obsv$: Observable<any>;
  public imageFile: File;

  constructor(private _httpService: HttpService, private toastrService: ToastrService, public activeModal: NgbActiveModal) {
    this.addChannelForm = new FormGroup({
      channelTitle: new FormControl("", [Validators.required]),
      channelDescription: new FormControl("", [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  submitData() {

  }

  submitAdd() {
    let formData=new FormData;
    if (this.imageFile){
      console.log('...Product Image has changed...')
      formData.append('channelImage', this.imageFile);
    }
    formData.append('channelTitle', this.addChannelForm.value.channelTitle)
    formData.append('channelDescription', this.addChannelForm.value.channelDescription)

    this.obsv$ = this._httpService.omniPost("/channel-category/create-channel-category", formData).pipe(
      map((resp: Record<string, string>): Record<string, string> => {
        if(resp && resp.respCode == "00") {
          this.activeModal.close('success');
          Swal.fire('Channel Created',
            'Channel created successfully',
            'success').then(r => console.log(r))
          return resp;
        } else {
          this.activeModal.close('error');
          Swal.fire('Channel creation error',
            'Channel could not be created.',
            'error').then(r => console.log(r))
          this.addChannelForm.reset;
          throw new Error("Channel creation failed");
        }
      }),
      catchError((error) => {
        if(error.error instanceof ErrorEvent) {
          this.errorMsg = `Error: ${error.error.message}`;
          this.toastrService.error(this.errorMsg, "Channel Creation Error");
          this.addChannelForm.reset;
        } else {
          this.errorMsg = `Error: ${error.message}`;
          this.toastrService.error(this.errorMsg, "Channel Creation Error");
          this.addChannelForm.reset;
        }
        return of([]);
      })
    )
  }

  submitEdit(data: any): any {
    let formData=new FormData;
    if (this.imageFile){
      console.log('...Product Image has changed...')
      formData.append('channelImage', this.imageFile);
    }
    formData.append('channelTitle', this.addChannelForm.value.channelTitle);
    formData.append('channelDescription', this.addChannelForm.value.channelDescription);

    
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.imageFile = event.target.files[0];
    }
  }
}
