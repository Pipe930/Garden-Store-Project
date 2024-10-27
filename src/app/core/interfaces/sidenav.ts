export interface Sidenav {
  routerLink: string;
  icon?: string;
  expanded?: boolean;
  label: string;
  items?: Sidenav[];
}

export interface SidenavToggle {
  screenWidth: number;
  collapsed: boolean;
}
