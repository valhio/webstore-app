export class User {
  id: string = '';
  username: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  address: string = '';
  profileImageUrl?: string = '';
  role: string = '';
  authorities: Array<string> = [];
  createdAt: Date | null = null;
  lastLoginDate: Date | null = null;
  isActive: boolean = false;
  isNotLocked: boolean = false;
  // isAuthenticated: boolean;

   constructor(user: any) {
    this.id = user.id? user.id : '';
    this.username = user.username? user.username : '';
    this.email = user.email? user.email : '';
    this.firstName = user.firstName? user.firstName : '';
    this.lastName = user.lastName? user.lastName : '';
    this.phone = user.phone? user.phone : '';
    this.address = user.address? user.address : '';
    this.profileImageUrl = user.profileImageUrl? user.profileImageUrl : '';
    this.role = user.role? user.role : '';
    this.authorities = user.authorities? user.authorities : [];
    this.createdAt = user.createdAt? user.createdAt : null;
    this.lastLoginDate = user.lastLoginDate? user.lastLoginDate : null;
    this.isActive = user.isActive? user.isActive : false;
    this.isNotLocked = user.isNotLocked? user.isNotLocked : false;
   }

  // constructor(init?: Required<User>) { // This constructor will allow us to pass in an object with properties and assign any matching to the class
  //   Object.assign(this, init); // Assign all properties from init to this
  // }
  // Partial is a generic type that allows us to pass in a type and it will return a type that has all the properties of the type passed in as optional

}
