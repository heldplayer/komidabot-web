import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tabbed-container',
  templateUrl: './tabbed-container.component.html',
  styleUrls: ['./tabbed-container.component.scss']
})
export class TabbedContainerComponent implements OnInit {
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  @Input()
  navigation: TemplateRef<any>;
  @Input()
  tabInfo: NavigationTabInfo;

  constructor() {
  }

  ngOnInit(): void {
  }

  get previousLink(): NavigationLink {
    return this.tabInfo.previous;
  }

  get nextLink(): NavigationLink {
    return this.tabInfo.next;
  }

  get tabTitle(): Observable<string> | undefined {
    return this.tabInfo.title;
  }

  get tabDescription(): Observable<string> | undefined {
    return this.tabInfo.titleDescription;
  }
}

export interface NavigationTabInfo {
  title?: Observable<string>;
  titleDescription?: Observable<string>;
  next: NavigationLink;
  previous: NavigationLink;
}

export interface NavigationLink {
  url?: string[];
  description?: Observable<string>;
}
