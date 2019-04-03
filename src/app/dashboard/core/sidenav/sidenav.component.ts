import { Component, Input, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

import { SidenavRoute } from '../model/index';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @Input() public fixedInViewport: boolean;
  @Input() public mode: string;
  @Input() public open: boolean;
  @Input() public routes: SidenavRoute[];

  @ViewChild('sideNav') private sideNav: MatSidenav;
}
