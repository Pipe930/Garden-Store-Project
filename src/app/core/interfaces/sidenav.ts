export interface Sidenav {
  routerLink: string;
  icon?: string;
  expanded?: boolean;
  label: string;
  items?: Array<Sidenav>;
}

export interface SidenavToggle {
  screenWidth: number;
  collapsed: boolean;
}
