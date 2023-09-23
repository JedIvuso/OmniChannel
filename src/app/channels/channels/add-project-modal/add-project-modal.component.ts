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
  addProjectForm: FormGroup;
  errorMsg: string;
  obsv$: Observable<any>;

  constructor(private _httpService: HttpService, private toastrService: ToastrService,) {
    this.addProjectForm = new FormGroup({
      projectImage: new FormControl("", [Validators.required]),
      projectName: new FormControl("", [Validators.required]),
      projectDescription: new FormControl("", [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  submit() {
    const model: any = {
      projectImage: this.addProjectForm.value.projectImage,
      projectName: this.addProjectForm.value.projectName,
      projectDescription: this.addProjectForm.value.projectDescription
    };
    this.obsv$ = this._httpService.omniPost("project-category/create-project-category", model).pipe(
      map((resp: Record<string, string>): Record<string, string> => {
        if(resp && resp.respCode == "00") {
          this.toastrService.success(resp.message, "Project created successfully");
          return resp;
        } else {
          this.toastrService.error(resp.message, "Project creation failed");
          this.addProjectForm.reset;
          throw new Error("Projection creation failed");
        }
      }),
      catchError((error) => {
        if(error.error instanceof ErrorEvent) {
          this.errorMsg = `Error: ${error.error.message}`;
          this.toastrService.error(this.errorMsg, "Projection Creation Error");
          this.addProjectForm.reset;
        } else {
          this.errorMsg = `Error: ${error.message}`;
          this.toastrService.error(this.errorMsg, "Projection Creation Error")
          this.addProjectForm.reset;
        }
        return of([]);
      })
    )
  }

}
