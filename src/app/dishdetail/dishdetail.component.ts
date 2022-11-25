import { Component, OnInit, ViewChild ,Inject} from '@angular/core';
import { Dish } from "../Shared/dish";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Comment } from '../shared/comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {
  @ViewChild('fform') dishdetailFormDirective;
  dishdetailForm: FormGroup;
  comment: Comment;
  dish: Dish;
  dishcopy = null;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  visibility = 'shown';

  formErrors = {
    'author': '',
    'comment': ''
  };
  validationMessages = {
    'author': {
      'required': 'first author is required.',
      'minlength': 'first author must be at least 2 chs long',
      'maxlength': 'first author can not be more 25 chs long'
    },
    'comment': {
      'required': 'first author is required.',
      'minlength': 'first author must be at least 2 chs long'
    }
  };

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { this.createForm()}

  ngOnInit() {
    // let id = +this.route.snapshot.params["id"];
    // this.dishservice.getDish(id.toString())
    //   .subscribe(dish => this.dish = dish);
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); } 
    ,errmess => this.errMess = <any>errmess);
  }

  goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  createForm() {
    this.dishdetailForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      rating: ['5'],
      date: ['']
    });
    this.dishdetailForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.dishdetailForm) { return; }
    const form = this.dishdetailForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.dishdetailForm.value;
    this.comment.date = (new Date).toISOString();
    this.dishcopy= this.comment;
    
    this.dish.comments.push(this.comment);
    this.dishdetailForm.reset({
      author: '',
      comment: '',
      rating: '5'
    });
    // this.dishdetailFormDirective.resetForm();
  }
}




