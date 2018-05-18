import { NgModule } from '@angular/core';
import { PostPage } from './post';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    PostPage,
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
  ],
  entryComponents: [
    PostPage,
  ],
  exports: [
    PostPage
  ]
})
export class PostPageModule {}
