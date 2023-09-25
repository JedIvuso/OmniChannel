import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpService } from 'src/app/shared/http.service';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.scss']
})
export class AddProjectModalComponent implements OnInit {
  addChannelForm: FormGroup;
  errorMsg: string;
  obsv$: Observable<any>;
  public imageFile: File;

  constructor(private _httpService: HttpService, private toastrService: ToastrService,) {
    this.addChannelForm = new FormGroup({
      channelTitle: new FormControl("", [Validators.required]),
      channelDescription: new FormControl("", [Validators.required])
    })
  }

  ngOnInit(): void {
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
          this.toastrService.success(resp.message, "Channel created successfully");
          return resp;
        } else {
          this.toastrService.error(resp.message, "Channel creation failed");
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

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.imageFile = event.target.files[0];
    }
  }
}
