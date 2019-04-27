import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the second post'},
  //   {title: 'Third Post', content: 'This is the third post'}
  // ]

  posts = [];
  // define a variable to hold the subscription
  // so that we can unsubscribe when the component is destroyed
  private postSub: Subscription;

  constructor(private postService: PostsService) { }

  ngOnInit() {
    this.postService.getPosts();
    // subscribe can take three arguments,
    // one is what to do when there is change to the data
    // another what to do when error occurs
    // the last is what to do when complete
    this.postSub = this.postService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}