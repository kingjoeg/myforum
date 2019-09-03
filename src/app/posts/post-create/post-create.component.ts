import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = 'create';
  form: FormGroup;
  imagePreview: string;
  postId: string;

  constructor(private postsService: PostsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [ Validators.required, Validators.minLength(3) ] }),
      content: new FormControl(null, { validators: [ Validators.required ] }),
      image: new FormControl(null, { validators: Validators.required, asyncValidators: mimeType }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';

        // Return the data for a single post
        this.postId = paramMap.get('id');
        this.postsService.getPost(this.postId).subscribe(post => {
          // populate form fields with the post's existing data
          this.form.setValue({
            title: post.title,
            content: post.content,
            image: post.imagePath
          });
        });

      }
    });
  }

  onSavePost() {
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
  }


  onImagePicked(event) {
    // Add image file to form group
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    // Update image preview using File API
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);
  }
}
