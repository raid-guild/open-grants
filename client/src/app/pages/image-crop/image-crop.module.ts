import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { ImageCropComponent } from './image-crop.component';



@NgModule({
  declarations: [ImageCropComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    HttpClientModule,
  ],
  providers: [UserService]
})
export class ImageCropModule { }
