import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

const STORE_BASE_URL = 'https://fakestoreapi.com';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  getAllProducts(
    size = '12',
    sort = 'asc',
    page = '1',
    category?: string
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${STORE_BASE_URL}/products${
        category ? '/category/' + category : ''
      }?limit=${size}&sort=${sort}&page=${page}`
    );
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${STORE_BASE_URL}/products/categories`);
  }

  getMockData(): Observable<Product[]> {
    return of(this.mockData);
  }

  findMockById(id: number): Product | null {
    let mock = this.mockData.find((product) => product.id === id);
    return mock ? mock : null;
  }

  mockData: Product[] = [
    {
      id: 1,
      name: 'Black & White Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
         | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-1.jpg',
      category: 'Quartz Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 2,
      name: 'Black & Orangle Marble',
      price: 60.0,
      description:
        'The Resin wrist rest, which is made of a combination of epoxy resin and has a baking finish surface. It is normal that there may be small bubbles in the resin. So handicrafts are not flawless products.',
      image: '/assets/images/wrist-rests/wrist-rest-2.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 3,
      name: 'White Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-3.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 4,
      name: 'Blue Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-4.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 5,
      name: 'White & Light Gray Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-5.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 6,
      name: 'Black & White Quartz',
      price: 60.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-6.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
    {
      id: 7,
      name: 'Black & White Quartz V2',
      price: 60.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-7.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
    {
      id: 8,
      name: 'Coral-Blue Resin',
      price: 60.0,
      description: `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-8.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 9,
      name: 'White-Pearl Resin',
      price: 60.0,
      description: `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-9.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 10,
      name: 'Coral-Green Marble',
      price: 60.0,
      description: `Material: Resin | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-10.jpg',
      category: 'Resin Wrist Rests',
      quantity: 1,
    },
    {
      id: 11,
      name: 'V2 Black & White Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
         | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-1.jpg',
      category: 'Quartz Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 12,
      name: 'V2 Black & Orangle Marble',
      price: 60.0,
      description:
        'The Resin wrist rest, which is made of a combination of epoxy resin and has a baking finish surface. It is normal that there may be small bubbles in the resin. So handicrafts are not flawless products.',
      image: '/assets/images/wrist-rests/wrist-rest-2.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 13,
      name: 'V2 White Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-3.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 14,
      name: 'V2 Blue Granite',
      price: 70.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-4.jpg',
      category: 'Stone Wrist Rests',
      quantity: 1,
    },
    {
      id: 15,
      name: 'V2 White & Light Gray Marble',
      price: 65.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-5.jpg',
      category: 'Marble Wrist Rests',
      quantity: 1,
    },
    {
      id: 16,
      name: 'V2 Black & White Quartz',
      price: 60.0,
      description: `Material: Quartz stones | Dimensions: 60%: 296 x 80 x 20 mm;  65%/75%: 320 x 80 x 20 mm 80%:360 x 80 x 20 mm
      | Package Weight: 60% :Around 880g;  65%: Around 990g | Including: Wrist rest, Rubber feet   `,
      image: '/assets/images/wrist-rests/wrist-rest-6.jpg',
      category: 'Quartz Wrist Rests',
      quantity: 1,
    },
  ];
}
