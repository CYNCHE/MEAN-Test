import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';


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

  // inject postService to get data,
  // ActivatedRoute to get the current post id
  constructor(private postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit',
        this.postId = paramMap.get('postId');
        this.post = this.postsService.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(postForm: NgForm) {
    console.log("here");
    if (postForm.invalid) return;
    if (this.mode === "create") {
      console.log("create");
      console.log(postForm.value.title);

      this.postsService.addPost(postForm.value.title, postForm.value.content);
    } else {
      console.log(postForm.value.title);
      this.postsService.updatePost(this.postId, postForm.value.title, postForm.value.content);
    }
    postForm.resetForm();
  }

}
