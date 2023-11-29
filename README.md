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
  ### Security
  - **User Authentication and Authorization** - Ensures secure access to your website by verifying user identities and assigning specific roles and authorities, controlling what actions and data different users are permitted to access.
  - **User Registration and Login with JWT Tokens** - Facilitates a secure and streamlined user onboarding process, allowing users to register and log in using JSON Web Tokens (JWT) for authentication, enhancing the overall security of user credentials.
  - **Account Lockout** - This security measure is implemented to protect user accounts from unauthorized access attempts, such as brute-force attacks where an attacker systematically tries different combinations of usernames and passwords to gain access to an account. When a user exceeds a certain    number of login attempts, the account is temporarily locked or disabled, preventing further login attempts for a specific period. The lockout period gives the legitimate account owner time to notice and respond to the suspicious activity, such as resetting their password or contacting support.

  ### Responsive Design
  - **Optimized for All Devices** - Ensures a seamless and enjoyable user experience across various devices by implementing responsive design principles. The website dynamically adapts to different screen sizes, including desktops, tablets, and mobiles. This feature guarantees that users can effortlessly navigate and interact with the website, regardless of the device they choose, fostering accessibility and user satisfaction. Whether customers are shopping from a desktop computer or a mobile device, the website's content and functionality remain visually appealing and fully functional.

  ### Product Management
  - **Product Search and Filtering** - Enables users to quickly find desired products through a robust search functionality, coupled with filtering options, enhancing the user experience and helping customers locate specific items efficiently.
  - **Product Details** - Provides comprehensive information about each product, aiding customers in making informed purchase decisions by offering details such as specifications, features, and pricing.
  - **Product Reviews & Rating Features** - Encourage user engagement and trust by allowing customers to leave reviews and ratings for products, providing valuable insights to other potential buyers, and creating a sense of community around your products.

  ### Shopping and Cart Management
  - **Shopping Cart Management** - Allows users to add and manage selected items in their shopping cart, providing a seamless and user-friendly experience for customers to review and modify their chosen products before proceeding to checkout.
  - **Add to Wishlist Feature** - Enhances the user experience by enabling customers to create wishlists, allowing them to save and track desired products for future reference or potential purchase.
  - **Checkout Process** - Guides users through the final steps of the purchasing journey, collecting necessary information, and facilitating a smooth transition from product selection to payment completion.

  ### Payment and Transactions:
  - **Online Payment System Using Stripe** - Integrates a secure and widely used payment gateway, Stripe, to facilitate online transactions, ensuring a seamless and trustworthy payment process for customers.
  - **Payment on Delivery (POD) Transaction** - Offers customers the flexibility to choose a "Payment on Delivery" method, allowing them to pay for their purchases with cash or an accepted payment method upon receiving the ordered items. This feature enhances customer trust and provides an     additional layer of convenience. The "Payment on Delivery" option is seamlessly integrated into the checkout process, giving customers a choice in how they settle their transactions.

  ### User Account Management
  - **User Account Data Management** - Empowers users to manage their account information, including personal details and preferences, providing a user-friendly interface for updating and customizing their profiles.

  ### Admin Product Management
  - **Product Creation and Administration** - Streamlines the process for administrators/managers to add new products to the webstore, providing a dedicated interface with fields for product details, images, pricing, and inventory management. This feature empowers administrators to efficiently update and modify product information, ensuring that the catalog is up-to-date and accurately reflects the available inventory. Admin users can also oversee the addition of new products, making it a pivotal tool for maintaining a dynamic and responsive online storefront.

  ### Admin Order Management
- **Efficient Order Oversight and Status Control** - Empowers administrators/managers with comprehensive tools to manage orders effectively. This feature allows them to review and modify order details, check product availability, and take actions based on the stock status. Admins can quickly identify products that are out of stock and cancel them if necessary. Additionally, they have the authority to set and update order statuses, ensuring accurate tracking and communication with customers. With predefined order statuses such as "ORDER PLACED", "PENDING", "OUT FOR DELIVERY", "DELIVERED", "CANCELED", "REFUNDED", and "RETURNED", this feature provides a centralized hub for overseeing the entire order lifecycle, optimizing efficiency and customer satisfaction.


## Technologies

The E-commerce frontend was built using the following technologies:

- Angular
- Typescript
- Tailwind
- SCSS
- Google Cloud Firebase Hosting
- Google Cloud Firebase Functions
- Stripe Online Payment

## Contributing

If you'd like to contribute to the E-commerce frontend, please follow these steps:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


