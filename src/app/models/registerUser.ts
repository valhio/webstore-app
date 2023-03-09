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

    constructor(init?: Partial<RegisterUser>) {
        Object.assign(this, init);
    }

}