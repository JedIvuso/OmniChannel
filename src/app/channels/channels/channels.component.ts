import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  getVideo() {
    this.router.navigate(['channels/training-demos'])
  }
}
