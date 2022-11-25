import { Component, OnInit ,Inject} from '@angular/core';
import { Dish } from '../Shared/dish'

import { DishService } from "../services/dish.service";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
}) 
export class MenuComponent implements OnInit {
  errMess: string;
  dishes: Dish[];
y
  constructor(private dishService: DishService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }

}
