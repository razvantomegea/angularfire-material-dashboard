export class AuthInfo {
  constructor(
    public code: string,
    public message: string,
    public extras?: any
  ) {}
}
