import { NgModule } from '@angular/core';
import { PostPage } from './post';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  declarations: [
    PostPage,
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
  ]
})
export class PostPageModule {}
