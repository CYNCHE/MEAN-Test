import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  public post: Post;
  // indicator for spinner
  public isLoading: boolean = false;
  form: FormGroup;
  // for picture url
  imagePreview: string;

  // inject postService to get data,
  // ActivatedRoute to get the current post id
  constructor(private postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      // initial state and form control options(say validators)
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      // no need to bind this form control to any html template
      // because we will use behind the scene
      'image': new FormControl(null, { validators: Validators.required, asyncValidators: [mimeType]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit',
          this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: null };
            this.form.setValue({ 'title': this.post.title, 'content': this.post.content, 'image': null });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    // informs Angular that the value has been changed
    // and it should re-evaluate that, store that value
    // and check it is valid
    this.form.get('image').updateValueAndValidity();

    // to create url for image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onSavePost() {
    console.log("savepost");
    if (this.form.invalid) return;
    // no need to reset since we will navigate away
    this.isLoading = true;
    if (this.mode === "create") {
      console.log("create");
      console.log(this.form.value.title);
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      console.log(this.form.value.title);
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

}
