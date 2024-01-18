
export default interface Review {
    id: string;
    productId: number;
    userId: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    likes: any[];
    comments: any[];
    user: any;
}