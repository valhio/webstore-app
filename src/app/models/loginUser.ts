export class LoginUser {
  email: string = '';
  password: string = '';

  constructor(user: any) {
    this.email = user.email? user.email : '';
    this.password = user.password? user.password : '';
  }
}