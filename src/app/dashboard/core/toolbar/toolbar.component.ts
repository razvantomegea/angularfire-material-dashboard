import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { TitleService } from 'app/core/services/title.service';
import * as fromUser from 'app/core/store/user/reducers/index';
import { ComponentDestroyed } from 'app/shared/mixins';
import { UserInfo } from 'app/shared/models';
import { filter, Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent extends ComponentDestroyed implements OnInit {
  public title = '';
  public userInfo: UserInfo;
  @Output() private readonly logout: EventEmitter<void> = new EventEmitter<void>();
  @Output() private readonly sideNavToggle: EventEmitter<void> = new EventEmitter<void>();
  private readonly userInfo$: Observable<UserInfo> = this.store.pipe(select(fromUser.getUser), takeUntil(this.isDestroyed$));

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<UserInfo>,
    private titleService: Title
  ) {
    super();
  }

  public ngOnInit(): void {
    TitleService.getRouteTitle(this.activatedRoute).pipe(take(1)).toPromise()
      .then((title: string) => {
        this.title = title;
        this.titleService.setTitle(title);
      });

    TitleService.getRouteTitleFromEvents(this.router.events, this.activatedRoute)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((title: string) => {
        this.title = title;
        this.titleService.setTitle(title);
      });

    this.userInfo$
      .pipe(filter((userInfo: UserInfo) => !!userInfo))
      .subscribe((userInfo: UserInfo) => {
        this.userInfo = userInfo;
      });
  }

  public getTooltipUserInfo(): string {
    if (!this.userInfo) {
      return '';
    }

    return `${this.userInfo.displayName} (${this.userInfo.email})`;
  }

  public onLogout(): void {
    this.logout.emit();
  }

  public onToggleSideNav(): void {
    this.sideNavToggle.emit();
  }
}
