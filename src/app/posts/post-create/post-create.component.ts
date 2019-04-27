import { PostsService } from './../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';

  constructor(private postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) return;

    this.postsService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }

}
