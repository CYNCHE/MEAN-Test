import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { Title } from '@angular/platform-browser';


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

  // inject postService to get data,
  // ActivatedRoute to get the current post id
  constructor(private postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      // initial state and form control options(say validators)
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit',
          this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.isLoading = false;
            this.post = { id: postData._id, title: postData.title, content: postData.content };
            this.form.setValue({ 'title': this.post.title, 'content': this.post.content });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    console.log("here");
    if (this.form.invalid) return;
    // no need to reset since we will navigate away
    this.isLoading = true;
    if (this.mode === "create") {
      console.log("create");
      console.log(this.form.value.title);
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      console.log(this.form.value.title);
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

}
