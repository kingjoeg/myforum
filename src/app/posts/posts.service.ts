import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[];
  private postsUpdated = new Subject<{ posts: Post[], maxPosts: number }>();

  constructor(private http: HttpClient) {}

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  getPosts(pageSize: number, pageIndex: number) {
    const queryParams = `?pagesize=${pageSize}&pageindex=${pageIndex}`;
    this.http.get<{ message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedData => {
        this.posts = transformedData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          maxPosts: transformedData.maxPosts
        });
      });
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }
}
