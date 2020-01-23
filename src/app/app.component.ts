import { map, filter, scan, mergeMap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public currentPage: string;
  public routeSub;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    this.setCurrentPageTitle();
    this.setCurrentPageURL();
  }

  setCurrentPageURL() {
    this.routeSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentPage = val.url.substr(1);
      }
    });
  }
  setCurrentPageTitle() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router)
      )
      .subscribe((event) => {
        const title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
        this.titleService.setTitle(title);
      });
  }

  // collect that title data properties from all child routes
  // there might be a better way but this worked for me
  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnDestroy() {
    if (undefined !== this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
