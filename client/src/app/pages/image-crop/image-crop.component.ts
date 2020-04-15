import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
import { UserManagementService } from 'src/app/services/user-management.service';
import { HTTPRESPONSE } from 'src/app/common/http-helper/http-helper.class';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss'],
})
export class ImageCropComponent implements OnInit {
  userData: any;
  toastTitle: "profile"
  imageData: any;
  croppedImage: any = '';

  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private userManagementService: UserManagementService,
    private userService: UserService,
    private toastr: ToastrService,
    public events: Events,
    public router: Router
  ) {
    this.imageData = navParams.get('imageData');
  }

  ngOnInit() { }

  imageCropped(event: ImageCroppedEvent) {
    console.log("imageCropped");
    this.croppedImage = event;
  }
  imageLoaded() {
    console.log("imageLoaded")
  }
  cropperReady() {
    console.log("cropperReady")
  }
  loadImageFailed() {
    console.log("loadImageFailed")
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  upload() {
    var file = this.dataURLtoFile(this.croppedImage.base64, 'profile.jpeg')
    console.log("file", file);
    if (file) {
      this.userService.uploadProfile(file).subscribe((res: HTTPRESPONSE) => {
        if (res.message) {
          this.userData = res.data;
          this.modalCtrl.dismiss(this.userData);
          this.events.publish('profile-change', true);
          this.toastr.success('Profile upload successfully', this.toastTitle);
        }
      }, (err) => {
        this.toastr.error('Error Uploading. Please try after sometime', this.toastTitle);
      });
    }
  }
}
