import {Component} from '@angular/core';
import {courseIcons, CourseSubType, CourseType} from '../entities';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent {

  images: Image[] = [];

  constructor(
    private translate: TranslateService,
  ) {
    this.images.push({
      // language=file-reference
      url: '/assets/twemoji/indicator_warning.svg',
      description: translate.instant('MENU.PROVISIONAL')
    }, {
      // language=file-reference
      url: '/assets/twemoji/indicator_closed.svg',
      description: translate.instant('CAMPUS.CLOSED.DESCRIPTION')
    }, {
      // language=file-reference
      url: '/assets/twemoji/indicator_go-to-today.svg',
      description: translate.instant('CAMPUS_LIST.GO.DESCRIPTION')
    });

    for (let i = CourseType.SOUP; i <= CourseType.SUB; ++i) {
      for (let j = CourseSubType.NORMAL; j <= CourseSubType.VEGAN; ++j) {
        this.images.push({
          url: courseIcons[i][j],
          description: translate.instant(`COURSE_ICON.DESCRIPTION.${i}.${j}`)
        })
      }
    }
  }

}

interface Image {
  url: string;
  description: string;
}
