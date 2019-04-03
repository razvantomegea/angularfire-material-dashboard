export class SidenavRoute {
  constructor(
    public icon: string | string[],
    public iconType: string,
    public lastOfKind: boolean,
    public name: string,
    public path: string,
    public subheader?: string
  ) {
  }
}
