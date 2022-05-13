import { Component, OnInit } from '@angular/core';
import { UpcomingService } from '../Shared/upcoming.service';
import { SnkimgService } from '../Shared/snkimg.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { upcomingPost } from '../Models/upcomingPost'; 
class ImageSnippet {
  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {
  Title = "UpcomingSneakers"
  constructor(private UpcomingService: UpcomingService, private SnkImgService: SnkimgService) { }
  data: any;
  allPosts: upcomingPost[];
  currPost: upcomingPost;
  submitted = false;
  readonly = true;
  isLoading = true;
  EventValue: any = "Save";
  prevView: any;
  currView: any;
  PostForm = new FormGroup({
    Brand: new FormControl("", [Validators.required]),
    Name: new FormControl("", [Validators.required]),
    ReleaseDate: new FormControl(null),
    RetailPrice: new FormControl("", [Validators.required]),
    Raffle: new FormControl("", [Validators.required]),
    Link1: new FormControl("", [Validators.required]),
    ID: new FormControl("", [Validators.required]),
    DbImage: new FormControl(null),
  })
  uploadData: FormData;
  filename = '';
  testtext: any;
  postImg: any;
  imgListData: any;
  isImgLoading = true;
  selectedFile: ImageSnippet;

  ngOnInit(): void {
    this.getPosts();
    //this.getPostImages();
    this.PostForm = new FormGroup({
      Brand: new FormControl("", [Validators.required]),
      Name: new FormControl("", [Validators.required]),
      ReleaseDate: new FormControl(null),
      RetailPrice: new FormControl("", [Validators.required]),
      Raffle: new FormControl("", [Validators.required]),
      Link1: new FormControl("", [Validators.required]),
      ID: new FormControl("", [Validators.required]),
      DbImage: new FormControl(null),
    })
  }


  /// Begin SneakerImgController Calls ///
  getImages() {
    this.SnkImgService.getAllImages().subscribe((data: any[]) => {
      this.imgListData = data;
      this.postImg = this.imgListData[0];
    })
  }

  getImg(id: string) {
    this.isImgLoading = true;
    this.SnkImgService.getImage(id).subscribe((data: any[]) => {
      this.isImgLoading = false;
      this.postImg = data[0];
    })
  }

  setFilename(files: any[]) {
    if (files[0]) {
      this.filename = files[0].name;
    }
  }

  saveImg(files: Blob[]) {
    if (!files) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    let fileToUpload = <File>files[0];
    this.uploadData.append('file', fileToUpload, fileToUpload.name);
    console.log(JSON.stringify(this.uploadData));
    this.uploadData.forEach((value, key) => {
      console.log(key + " " + value)
    });

    this.SnkImgService
      .upload(this.uploadData)
      .subscribe((data: any) => {
        this.testtext = data;
      });
  }
  /// End SneakerImgController Calls ///

  getPosts() {
    this.UpcomingService.getAll().subscribe((postData: upcomingPost[]) => {
      this.isLoading = false; 
      this.allPosts = postData;
    })
  }

  getPostImages() {
    this.allPosts.forEach((element) => { 
      /*this.SnkImgService.getImage(element.imgSrc).subscribe((data: any) => {
        this.postImg = data;
      })
      element.imgData = this.postImg;*/
      console.log(element.imgSrc);
    }); 
  }

  getUpcomingPost(id:string) {
    this.UpcomingService.get(id).subscribe((data: any) => {
      this.data = data;
    })
  }

  EditData(Data: any) {
    this.getImg(Data.dbImage);
    this.PostForm.controls["Brand"].setValue(Data.brand);
    this.PostForm.controls["Name"].setValue(Data.name);
    this.PostForm.controls["ReleaseDate"].setValue(Data.releaseDate);
    this.PostForm.controls["RetailPrice"].setValue(Data.retailPrice);
    this.PostForm.controls["Raffle"].setValue(Data.raffle);
    this.PostForm.controls["Link1"].setValue(Data.link1);
    this.PostForm.controls["ID"].setValue(Data.id);
    this.EventValue = "Update";
    this.readonly = false;
  }

  Save() {
    if (this.PostForm.invalid) {
      return;
    }
    this.UpcomingService.postData(this.PostForm.value).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
  }

  Delete(id: String | null) {
    if (id == null) {
      return;
    }
    this.UpcomingService.deleteData(id).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
  }

  Update() {
    this.submitted = true;
    if (this.PostForm.invalid) {
      return;
    }

    this.UpcomingService.putData(this.PostForm.value.UPC, this.PostForm.value).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
  }

  resetForm() {
    this.getPosts();
    this.PostForm.reset();
    this.clearImage();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = true;
  }

  clearImage() {
    this.filename = "";
  }

  crtForm() {
    this.PostForm.reset();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = false;
  }

}
