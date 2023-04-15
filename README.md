[![Lint, Test & Build - CI](https://github.com/valhio/webstore-with-api/actions/workflows/node.js.yml/badge.svg)](https://github.com/valhio/webstore-with-api/actions/workflows/node.js.yml)

# E-commerce Frontend

This is the frontend of an E-commerce RESTful API built with Angular, Typescript, Tailwind, and SCSS. The API includes security measures utilizing authentication and authorization in the form of user rights (Roles and Authorities). The API also includes a shopping cart, a checkout system, and a payment system using Stripe.
RESTful API built using Java, Spring Boot, Spring Web, JPA, Spring MVC, OAuth2-Jwt, MySQL Docker container, Spring Security, and Apache Maven.
The Frontend is currently hosted on Google Firebase and uses Firebase Functions to handle the payment system.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Installation

To configure the project, you'll need to follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/valhio/webstore.git
```

2. Install the dependencies:
```bash
npm install
```

3. Configure the environment file:

- Rename the `environment.example.ts` file to `environment.ts`
- Set the `apiUrl` property to the URL of your backend API
- Set the `stripePublicKey` property to the key of your Stripe account, if you intend to use the payment system
- Set the `firebase` property to the configuration of your Firebase project, if you intend to host the project on Firebase Hosting and use Firebase Functions to handle the payment system

4. Start the development server:
```bash
npm start
```

## Usage

To use the E-commerce frontend, open the URL `http://localhost:4200` in your browser. To authenticate as an admin, if using the corresponding API for this project(linked in the beginning of this README.md file), go to the URL `http://localhost:4200/register` and register a new user with the email address set as 'a@a.com' to authenticate as an admin. You can change the default admin email address in the API's `UserController` class, or you can set the newly registered user as an admin in the API's database. Finally, go to the URL `http://localhost:4200/orders/management` to access the orders management page. An admin dashboard is currently under development.

## Features

The E-commerce frontend includes the following features:

- User authentication and authorization with access levels in the form of Roles and Authorities
- User registration and login using JWT tokens
- Product search and filtering
- Product details
- Shopping cart management
- Checkout process
- Order management
- Payment system using Stripe
- Admin dashboard and management (only accessible by authenticated users with admin privileges)

## Technologies

The E-commerce frontend was built using the following technologies:

- Angular
- Typescript
- Tailwind
- SCSS
- Firebase Hosting
- Firebase Functions
- Stripe

## Contributing

If you'd like to contribute to the E-commerce frontend, please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


