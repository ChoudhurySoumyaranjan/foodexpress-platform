# FoodExpress – Full-Stack Food Ordering Platform

A modern, full-stack food ordering web application with a React frontend and Spring Boot backend. Users can browse food items, manage a cart, place orders with Razorpay payments, and track order status. Admins get a powerful dashboard for managing categories, foods, orders, users, contact queries, and analytics.

> **Coming soon:** Redis integration for caching, session/refresh-token storage, and rate limiting.

---

## ✨ Features

### Customer

* User registration & login (JWT + HttpOnly refresh token cookie)
* Browse foods by category and search
* Add, update, and remove items from cart
* Place orders with online payment (Razorpay) or other payment types
* View order history and order status
* Update profile and change password
* Forgot/reset password via email
* Contact form for support tickets

### Admin

* Secure admin-only routes (`ROLE_ADMIN`)
* CRUD for **Categories** with image upload via Cloudinary
* CRUD for **Foods** with image upload
* Manage **Orders** — update status, filter orders, and view totals
* Manage **Users** — block/unblock and search users
* Contact/support ticket management
* Analytics dashboard:

  * Revenue for the last 7 days
  * Order status distribution
  * Recent orders
  * Top-selling foods
  * Recent users and contact queries
* Swagger UI for API exploration

### Planned / Upcoming

* **Redis integration**

  * Caching for foods, categories, and analytics
  * Refresh-token/session storage and blacklisting
  * Rate limiting
  * Optional cart persistence

---

## 🛠 Tech Stack

### Frontend

| Technology                  | Purpose                       |
| --------------------------- | ----------------------------- |
| React 19 + Vite             | UI and build tool             |
| Tailwind CSS 4              | Styling                       |
| Material UI (MUI)           | Components and icons          |
| Redux Toolkit + React Redux | State management              |
| React Router DOM            | Routing                       |
| Axios                       | HTTP client with interceptors |
| React Toastify              | Notifications                 |
| Recharts                    | Admin analytics charts        |
| Lucide React / React Icons  | Icons                         |

### Backend

| Technology                  | Purpose                              |
| --------------------------- | ------------------------------------ |
| Spring Boot 3.3.5           | REST API                             |
| Spring Security + JWT       | Authentication and authorization     |
| Spring Data JPA + Hibernate | ORM                                  |
| MySQL                       | Primary database                     |
| Redis *(planned)*           | Caching, sessions, and rate limiting |
| Cloudinary                  | Image storage                        |
| Razorpay                    | Payment gateway                      |
| Spring Mail (Gmail SMTP)    | Password reset emails                |
| Springdoc OpenAPI           | Swagger UI                           |
| Lombok                      | Boilerplate reduction                |
| Java 21                     | Runtime                              |

### DevOps

* Docker + Docker Compose
* Multi-stage Docker builds
* Nginx for frontend production serving
* Maven for backend packaging

---

## 📁 Project Structure

```text
foodexpress/
├── frontend-react/                 # React + Vite app
│   ├── src/
│   │   ├── api/                    # Axios instance + interceptors
│   │   ├── auth/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── redux/                  # Store, auth slice, etc.
│   │   ├── routes/
│   │   └── utils/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend-spring/                 # Spring Boot app
│   ├── src/main/java/com/lucky/main/
│   │   ├── cloudinary/
│   │   ├── config/                 # SecurityConfig, RedisConfig (soon)
│   │   ├── controller/             # Auth, Cart, Order, Admin*, Payment...
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── enums/
│   │   ├── exception/
│   │   ├── filter/
│   │   ├── handler/
│   │   ├── mapper/
│   │   ├── repository/
│   │   ├── service/
│   │   └── utils/
│   ├── Dockerfile
│   └── pom.xml
│
└── docker-compose.yml              # Will include Redis service soon
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 20+
* Java 21
* Maven 3.9+
* MySQL 8+
* **Redis** *(optional for now; required after Redis integration)*
* Docker & Docker Compose *(recommended)*

---

## 1. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE fullstack_ecom;
```

---

## 2. Backend — Local Setup

Navigate to the backend:

```bash
cd backend-spring
```

Set the required environment variables.

### Linux / macOS / WSL

```bash
export db_url=jdbc:mysql://localhost:3306/fullstack_ecom
export db_username=root
export db_password=YOUR_PASSWORD

export jwt_secret_key=YOUR_SECURE_SECRET
export jwt_access_token_expiration=350000
export jwt_refresh_token_expiration=604800000

export cloudinary_cloud_name=YOUR_CLOUD_NAME
export cloudinary_api_key=YOUR_API_KEY
export cloudinary_api_secret=YOUR_API_SECRET

export mail_username=YOUR_GMAIL
export mail_password=YOUR_APP_PASSWORD

export razorpay_key=YOUR_RAZORPAY_KEY
export razorpay_secret=YOUR_RAZORPAY_SECRET
export razorpay_currency=INR
```

Alternatively, configure these values using `application-local.properties`.

### Future Redis Configuration

Uncomment these variables after Redis integration:

```bash
export redis_host=localhost
export redis_port=6379
export redis_password=
```

### Build and Run

```bash
mvn clean package -DskipTests
java -jar target/backend-spring.jar
```

Backend runs on:

```text
http://localhost:5001
```

Swagger UI:

```text
http://localhost:5001/swagger-ui.html
```

---

## 3. Frontend — Local Setup

Navigate to the frontend:

```bash
cd frontend-react
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Make sure `BACKEND_BASE_URL` in your frontend constants points to:

```text
http://localhost:5001
```

---

## 🐳 Docker Deployment

Docker Compose is the recommended way to run the complete application.

From the project root:

```bash
docker compose up --build
```

### Services

| Service  | Port Mapping | Description                       |
| -------- | -----------: | --------------------------------- |
| Backend  |  `5001:5001` | Spring Boot REST API              |
| Frontend |    `5173:80` | React application served by Nginx |

### Future Redis Service

Redis will be added to `docker-compose.yml` after Redis integration:

```yaml
redis:
  image: redis:7-alpine
  container_name: foodexpress-redis
  ports:
    - "6379:6379"
  restart: unless-stopped
```

---

## 🔐 Authentication Flow

FoodExpress uses JWT-based authentication with an HttpOnly refresh-token cookie.

### Current Flow

1. User registers or logs in.
2. Backend returns an **access token** in the response body.
3. Backend sets a **refresh token** as an HttpOnly cookie.
4. Axios request interceptor attaches:

   ```text
   Authorization: Bearer <accessToken>
   ```
5. When an API request returns `401`, the Axios response interceptor calls:

   ```text
   /api/auth/refresh-token
   ```
6. The refresh token is automatically sent through the cookie.
7. If refresh succeeds, a new access token is obtained.
8. If refresh fails, the user is logged out and redirected to the login page.
9. Development mode can disable interceptors using `DEV_MODE = true`.

### Future Redis Authentication

Redis will be used to:

* Store refresh-token/session information
* Validate active refresh tokens
* Revoke tokens
* Blacklist tokens when required
* Support distributed session management

### Roles

* `USER`
* `ADMIN`

Admin operations are protected using Spring Security and method-level authorization such as:

```java
@PreAuthorize("hasRole('ADMIN')")
```

---

## 📡 Key API Endpoints

### Public / Authentication

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | Register user          |
| POST   | `/api/auth/login`           | Login                  |
| POST   | `/api/auth/refresh-token`   | Refresh access token   |
| POST   | `/api/auth/logout`          | Logout                 |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password`  | Reset password         |

### Customer

| Method | Endpoint                     | Description                    |
| ------ | ---------------------------- | ------------------------------ |
| GET    | `/api/foods/all`             | Get all foods                  |
| GET    | `/api/foods/category/{id}`   | Get foods by category          |
| GET    | `/api/foods/search?keyword=` | Search foods                   |
| POST   | `/api/cart/add`              | Add item to cart               |
| GET    | `/api/cart/{userId}`         | Get user's cart                |
| POST   | `/api/orders/place`          | Place order                    |
| GET    | `/api/orders`                | Get user's orders              |
| POST   | `/api/payment/create-order`  | Create Razorpay order          |
| POST   | `/api/payment/verify`        | Verify payment                 |
| POST   | `/api/contact`               | Submit contact/support request |

### Admin

Admin APIs are available under:

```text
/admin/api/...
```

All admin endpoints require:

```text
ROLE_ADMIN
```

Admin functionality includes:

* Category management
* Food management
* Order management
* User management
* Contact/support management
* Analytics

For the complete API documentation, use Swagger UI.

---

## 🔧 Configuration Notes

### JWT

* Access tokens are short-lived.
* Refresh tokens have a longer expiration time.
* Refresh tokens are stored in an HttpOnly cookie.
* Refresh-token cookies should use `Secure=true` in production.

### CORS

Allowed development origins include:

```text
http://localhost:5173
http://localhost:3000
```

Add the production frontend domain before deployment.

### Cloudinary

Food and category images are uploaded to Cloudinary under:

```text
ecommerce/photos
```

### Razorpay

Razorpay supports test/live credentials through environment variables.

Required configuration:

```text
razorpay_key
razorpay_secret
razorpay_currency
```

### Email

Password reset emails are sent using Gmail SMTP.

Use a Gmail **App Password** rather than your normal Gmail password.

### File Uploads

Maximum file upload size:

```text
50 MB
```

### Redis — Planned

Redis will be introduced for:

* Application caching
* Food/category caching
* Analytics caching
* Refresh-token storage
* Token blacklisting
* Rate limiting
* Optional cart persistence

---

## 📦 Production Tips

1. **Never commit secrets** to Git. Use environment variables or a secrets manager.
2. Enable **HTTPS** in production.
3. Set `Secure=true` for refresh-token cookies.
4. Configure your production domain in CORS.
5. Use a proper managed/production MySQL instance.
6. Do not rely on `host.docker.internal` for production database configuration.
7. Add Redis for caching, token management, and rate limiting.
8. Add application health checks.
9. Add centralized logging and monitoring.
10. Use production Razorpay credentials only after completing payment testing.
11. Keep Docker images and dependencies updated.

---

## ❤️ Author

Built with ❤️ using:

**React + Spring Boot + MySQL + Docker**

---

**Happy Ordering! 🍔🍕**

> **Redis integration coming soon.**
