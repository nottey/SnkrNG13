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
  UpcomingForm = new FormGroup({
    Brand: new FormControl("", [Validators.required]),
    Name: new FormControl("", [Validators.required]),
    ReleaseDate: new FormControl(null),
    RetailPrice: new FormControl({ value: '' }, [Validators.required]),
    Raffle: new FormControl({ value: '' }, [Validators.required]),
    Featured: new FormControl({ value: '' }),
    Link1: new FormControl({ value: '' }, [Validators.required]),
    ImgSrc: new FormControl(""),
    ID: new FormControl({ value: ''}),

    PostID: new FormControl("", [Validators.required]),
    DbImage: new FormControl({ value: '', disabled: true }),
    DBImageB64: new FormControl({ value: '', disabled: true }),
    imageChanged: new FormControl(false),
  })
  uploadData: FormData;
  uploadImage: File;
  filename = '';
  testtext: any;
  postImg: any;
  imgData: string;
  imgListData: any;
  isImgLoading = true;
  selectedFile: ImageSnippet;

  ngOnInit(): void {
    this.getPosts();
    this.UpcomingForm.value.DbImage = "";
    this.UpcomingForm.value.DBImageB64 = "";
    this.UpcomingForm.value.imageChanged = false;
    this.UpcomingForm.value.imgSrc = ""; 
  }

  /////////////////////////
  /*  Can't load images into model for some reason
   *  Want to add counter of shoes on list that are in the table
   *  
   *
   *
   *
   */



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

  setFile(event: Event | null) {
    if (event == null) return;
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log("FileUpload -> files", fileList); 
      this.uploadImage = fileList[0];
      this.filename = this.uploadImage.name;
      this.UpcomingForm.controls["DbImage"].setValue(fileList.item.name);
      this.UpcomingForm.value.imageChanged = true;
      this.UpcomingForm.value.DBImageB64 = fileList.item.name; 
      this.UpcomingForm.value.imgSrc = fileList.item.name; 
    }
  } 

  saveImg(files: FileList | null) {
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
    this.UpcomingService.getAll().subscribe((postData: any[]) => {
      this.isLoading = false; 
      this.allPosts = postData;
      this.postImg = postData[0].dbImageB64;
      this.imgData = postData[0].dbImageB64;
    })
  }

  getUpcomingPost(id:string) {
    /*this.UpcomingService.get(id).subscribe((data: any) => {
      this.data = data;
      this.currPost = data; 
    })*/
  }

  EditData(Data: any) { 
    this.UpcomingForm.controls["Brand"].setValue(Data.brand);
    this.UpcomingForm.controls["Name"].setValue(Data.name);
    this.UpcomingForm.controls["ReleaseDate"].setValue(Data.releaseDate);
    this.UpcomingForm.controls["RetailPrice"].setValue(Data.retailPrice);
    this.UpcomingForm.controls["Raffle"].setValue(Data.raffle);
    this.UpcomingForm.controls["Link1"].setValue(Data.link1);
    this.UpcomingForm.controls["PostID"].setValue(Data.id);
    this.UpcomingForm.controls["ID"].setValue(Data.id);
    this.UpcomingForm.controls["DbImage"].setValue(Data.imgSrc);
    this.UpcomingForm.controls["DBImageB64"].setValue(Data.dbImageB64);
    this.UpcomingForm.controls["imageChanged"].setValue(Data.imageChanged);
    this.UpcomingForm.controls["ImgSrc"].setValue(Data.imgSrc);
    this.UpcomingForm.controls["Featured"].setValue(Data.featured);
    this.EventValue = "Update";
    this.UpcomingService.get(Data.brand, Data.id).subscribe((data: any) => {
      this.data = data;
    });
    this.readonly = false;
  }

  Save() {
    this.UpcomingForm.value.DbImage = "";
    this.UpcomingForm.value.DBImageB64 = "";
    this.UpcomingForm.value.imageChanged = false;
    this.UpcomingForm.value.ImgSrc = "";
    this.UpcomingForm.value.Featured = "";
    this.UpcomingForm.value.Raffle = false;
    this.UpcomingForm.value.ID = this.UpcomingForm.value.PostID;
    
    this.uploadData = this.UpcomingForm.value;
    if (this.UpcomingForm.invalid) {
      return;
    } 

    this.UpcomingService.postData(this.UpcomingForm.value).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
  }

  Delete(Data: any) {
    if (Data.id == null) {
      return;
    }
    this.UpcomingService.deleteData(Data.brand, Data.id).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
  }

  Update() {
    this.submitted = true;
    if (this.UpcomingForm.invalid) {
      return;
    }
    this.UpcomingForm.patchValue({
     // imageChanged: "false",
      //Featured: "false", 
    }); ;
    this.UpcomingService.putData(this.UpcomingForm.value.PostID, this.UpcomingForm.value).subscribe((data: any) => {
      this.data = data;
      this.resetForm();
    })
  }

  resetForm() {
    this.getPosts();
    this.UpcomingForm.reset();
    this.clearImage();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = true;
  }

  clearImage() {
    this.filename = "";
  }

  crtForm() {
    this.UpcomingForm.reset();
    this.EventValue = "Save";
    this.submitted = false;
    this.readonly = false;
  }

  AddToCollection(id: string) {

  }
}
