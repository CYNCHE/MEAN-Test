import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'



@Injectable({
  providedIn: 'root'
})


export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    // copy of posts not reference
    // return [...this.posts];
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      // transform data format since data return has id field named _id
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // get single posts
  getPost(id: string) {
    return {...this.posts.find(p => p.id === id)};
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content}
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        console.log(responseData.message);
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        // notify all subscribers
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title:string, content: string) {
    const post: Post = { id: id, title: title, content: content };
    this.http.put("http://localhost:3000/api/posts/" + id, post)
      .subscribe(response => console.log(response));
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id != postId);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
