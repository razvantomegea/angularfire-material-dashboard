import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from '../admin/services';
import { SidenavRoute } from './core/model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public readonly sideNavRoutes: SidenavRoute[];
  public mobileQuery: MediaQueryList;
  public sideNavFixed: boolean;
  public sideNavMode: string;
  public sideNavOpen: boolean;
  private readonly mobileQueryListener: () => void;
  @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;

  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private router: Router
  ) {
    this.mobileQueryListener = () => {
      this.setSideNav();
      this.changeDetectorRef.detectChanges();
    };
    this.sideNavRoutes = [
      new SidenavRoute('autorenew', 'material', true, 'Healthy habits', '/healthy-habits', 'Introduction'),
      new SidenavRoute('chrome_reader_mode', 'material', false, 'Environment', '/learn/environment', 'Learn'),
      new SidenavRoute('chrome_reader_mode', 'material', false, 'Fitness', '/learn/fitness'),
      new SidenavRoute('chrome_reader_mode', 'material', false, 'Microbiome', '/learn/microbiome'),
      new SidenavRoute('chrome_reader_mode', 'material', false, 'Nutrition', '/learn/nutrition'),
      new SidenavRoute('chrome_reader_mode', 'material', true, 'Vitality', '/learn/vitality'),
      new SidenavRoute('accessibility_new', 'material', false, 'Body composition', '/body-composition', 'Trackers'),
      new SidenavRoute('restaurant_menu', 'material', false, 'Nutrition', '/nutrition'),
      new SidenavRoute('directions_walk', 'material', false, 'Movement', '/movement'),
      new SidenavRoute('hotel', 'material', true, 'Sleep', '/sleep'),
      new SidenavRoute('colorize', 'material', false, 'Blood Glucose', '/blood-glucose', 'Biometrics'),
      new SidenavRoute('colorize', 'material', false, 'Blood Homocysteine', '/blood-homocysteine'),
      new SidenavRoute('colorize', 'material', false, 'Blood Ketones', '/blood-ketones'),
      new SidenavRoute('colorize', 'material', false, 'Blood Lipids', '/blood-lipids'),
      new SidenavRoute('colorize', 'material', true, 'Blood Pressure', '/blood-pressure'),
      new SidenavRoute(['fas', 'database'], 'fas', true, 'Foods', '/foods', 'Databases & Tools'),
      new SidenavRoute('settings', 'material', false, 'Settings', '/settings'),
      new SidenavRoute('help', 'material', false, 'Help & Feedback', '/help')
    ];
  }

  public ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  public ngOnInit(): void {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.setSideNav();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  public onLogout(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/admin']);
    });
  }

  public onSideNavToggle(): void {
    this.sideNavOpen = !this.sideNavOpen;
  }

  private setSideNav(): void {
    this.sideNavFixed = this.mobileQuery.matches;
    this.sideNavMode = this.mobileQuery.matches ? 'over' : 'side';
    this.sideNavOpen = !this.mobileQuery.matches;
  }
}
