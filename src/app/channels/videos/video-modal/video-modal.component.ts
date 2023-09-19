import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Peer from 'peerjs';
declare var MediaRecorder: any;

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
})
export class VideoModalComponent implements OnInit {
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
  @ViewChild('liveVideo') videoElementRef: ElementRef;
  @ViewChild('audioElement') audioElementRef: ElementRef;

  private peer: Peer;
  peerIdShare: string;
  peerId: string;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];

  videoElement: HTMLVideoElement;
  recordVideoElement: HTMLVideoElement;
  mediaVideoRecorder: any;
  videoRecordedBlobs: Blob[];
  isRecording: boolean = false;
  isSharing: boolean = false;
  downloadVideoUrl: string;
  stream: MediaStream | null = null;
  cameraStream: MediaStream | null = null;
  screenShareStream: MediaStream | null = null;
  isScreenSharing: boolean = false;
  audioElement: HTMLAudioElement;
  mediaAudioRecorder: any;
  audioRecordedBlobs: Blob[];
  isAudioRecording: boolean = false;
  downloadAudioUrl: string;

  constructor() {
    this.peer = new Peer();
  }

  ngOnInit(): void {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: 480,
        },
      })
      .then((stream) => {
        this.videoElement = this.videoElementRef.nativeElement;
        this.recordVideoElement = this.recordVideoElementRef.nativeElement;
        this.audioElement = this.audioElementRef.nativeElement;
        this.stream = stream;
        this.videoElement.srcObject = this.stream;
      });
      this.getPeerId();
  }

  getPeerId() {
    this.peer.on('open', (id) => {
      this.peerId = id;
    })
  }

  screenShare() {
    this.shareScreen()
  }

  private shareScreen(): void {
    navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find((s: { track: { kind: string; }; }) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media' + err);
    });
  }

  stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find((s: { track: { kind: any; }; }) => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack)
  }

  async startVideoRecording() {
    if (!this.stream) {
      // If there's no stream, request access to the camera
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 480,
          },
        });
        this.videoElement.srcObject = this.stream;
      } catch (err) {
        console.log(err);
        return;
      }
    }

    this.videoRecordedBlobs = [];
    let options: any = {
      mimeType: 'video/webm',
    };
    try {
      this.mediaVideoRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err);
    }
    this.mediaVideoRecorder.start();
    this.isRecording = !this.isRecording;
    this.onDataAvailableVideoEvent();
    this.onStopVideoRecordingEvent();
    this.startAudioRecording();
    this.onStopVideoRecordingEvent();
  }

  async stopVideoRecording() {
    this.mediaVideoRecorder.stop();
    this.isRecording = !this.isRecording;

    // Stop the camera stream
    if (this.stream) {
      this.stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      this.stream = null;
    }
  }

  playRecording() {
    if (!this.videoRecordedBlobs || !this.videoRecordedBlobs.length) {
      return;
    }
    this.recordVideoElement.play();
  }

  onDataAvailableVideoEvent() {
    try {
      this.mediaVideoRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.videoRecordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopVideoRecordingEvent() {
    try {
      this.mediaVideoRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.videoRecordedBlobs, {
          type: 'video/webm',
        });
        this.downloadVideoUrl = window.URL.createObjectURL(videoBuffer);
        this.recordVideoElement.src = this.downloadVideoUrl;
      };
    } catch (error) {
      console.log(error);
    }
  }

  async startAudioRecording() {
    if (!this.stream) {
      // If there's no stream, request access to the microphone
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          audio: true, // Request audio access
          video: {
            width: 480,
          },
        });
        this.videoElement.srcObject = this.stream;
      } catch (err) {
        console.log(err);
        return;
      }
    }

    this.audioRecordedBlobs = [];
    let options: any = {
      mimeType: 'audio/webm', // Set the appropriate audio MIME type
    };
    try {
      this.mediaAudioRecorder = new MediaRecorder(this.stream, options);
    } catch (err) {
      console.log(err);
    }
    this.mediaAudioRecorder.start();
    this.isAudioRecording = !this.isAudioRecording;
    this.onDataAvailableAudioEvent();
    this.onStopAudioRecordingEvent();
  }

  async stopAudioRecording() {
    this.mediaAudioRecorder.stop();
    this.isAudioRecording = !this.isAudioRecording;

    // Stop the microphone stream
    if (this.stream) {
      this.stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
      this.stream = null;
    }
  }

  playAudio() {
    if (!this.audioRecordedBlobs || !this.audioRecordedBlobs.length) {
      return;
    }
    this.audioElement.play();
  }

  onDataAvailableAudioEvent() {
    try {
      this.mediaAudioRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.audioRecordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopAudioRecordingEvent() {
    try {
      this.mediaAudioRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.audioRecordedBlobs, {
          type: 'video/webm',
        });
        this.downloadAudioUrl = window.URL.createObjectURL(videoBuffer);
        this.audioElement.src = this.downloadAudioUrl;
      };
    } catch (error) {
      console.log(error);
    }
  }
}
