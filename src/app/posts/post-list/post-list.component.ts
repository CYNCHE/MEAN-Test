import { PostsService } from './../posts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

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
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  // page start at 1
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private postService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, 1);
    // subscribe can take three arguments,
    // one is what to do when there is change to the data
    // another what to do when error occurs
    // the last is what to do when complete
    this.postSub = this.postService.getPostUpdatedListener()
      .subscribe((postsData: { posts:Post[], postCount: number }) => {
        this.isLoading = false;
        console.log(postsData);
        this.totalPosts = postsData.postCount;
        this.posts = postsData.posts;
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId)
    .subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    // show the spinner
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }


  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
