import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})


export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any,  maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      // transform data format since data return has id field named _id
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }), maxPosts: postData.maxPosts };
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        // copy of posts not reference
        // return [...this.posts];
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts });
      });
  }

  // get single posts
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string }>("http://localhost:3000/api/posts/" + id);
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // FormData is a data structure to combine text value
    // and blurb(file) data together
    console.log('add post');
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: responseData.post.imagePath
        // }
        // console.log(responseData.message);
        // const postId = responseData.post.id;
        // post.id = postId;
        // this.posts.push(post);
        // // notify all subscribers
        // this.postsUpdated.next([...this.posts]);

        // the above code block was commented out because whenever we
        // navigate to post-list component, getposts() will be called
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {

    let postData: FormData | Post;
    // if the user changes the image, then image is a file
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      // if the user only changes title and content, then image is a string
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        // const updatePosts = [...this.posts];
        // const oldPostIndex = updatePosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ""
        // }
        // updatePosts[oldPostIndex] = post;
        // this.posts = updatePosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }
}
