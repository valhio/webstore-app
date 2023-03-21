export class RegisterUser {
    username!: string;
    password!: string;
    email!: string;
    firstName!: string;
    lastName!: string;
    phone: string = '';
    address: string = '';
    profileImageUrl: string = '';
    role: string = '';
    authorities: Array<string> = [];
    createdAt: Date | null = null;
    lastLoginDate: Date | null = null;
    isActive: boolean = false;
    isNotLocked: boolean = false;
    acceptedTerms: boolean = false;

    // This is a constructor that takes an object and assigns it to the properties of the class
    constructor(init?: Partial<RegisterUser>) { // Partial<T> : makes all properties of T optional
        Object.assign(this, init);
    }

}