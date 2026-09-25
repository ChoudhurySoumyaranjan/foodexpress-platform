# FoodExpress – Full-Stack Food Ordering Platform

A modern, full-stack food ordering web application with a React frontend and Spring Boot backend. Users can browse food items, manage a cart, place orders with Razorpay payments, and track order status. Admins get a powerful dashboard for managing categories, foods, orders, users, contact queries, and analytics.

> **Redis is fully integrated** for caching frequently accessed data (foods, categories, carts, orders, analytics, users, and contact messages).

---

## ✨ Features

### Customer

* User registration & login (JWT + HttpOnly refresh token cookie)
* Browse foods by category and search
* Add, update, and remove items from cart
* Place orders with online payment (Razorpay) or Cash on Delivery
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

### Redis Caching (Implemented)

* Caching for foods, categories, carts, orders, users, contact messages, and analytics
* Cache eviction on create / update / delete operations
* Custom `PageResponse` DTO used instead of Spring Data `Page` for reliable Redis serialization

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
| **Redis**                   | Caching (foods, categories, carts, orders, analytics, users, contact messages) |
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
│   │   ├── config/                 # SecurityConfig, RedisConfig, CacheConfig
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── enums/
│   │   ├── exception/
│   │   ├── filter/
│   │   ├── handler/
│   │   ├── mapper/
│   │   ├── repository/
│   │   ├── service/
│   │   │   └── impl/               # *ServiceImpl with @Cacheable / @CacheEvict /@CachePut
│   │   └── utils/
│   ├── Dockerfile
│   └── pom.xml
│
└── docker-compose.yml              

---

# 🚀 Getting Started

## Prerequisites

* Node.js 20+
* Java 21
* Maven 3.9+
* MySQL 8+
* Redis 7+
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

### Environment Variables

#### Linux / macOS / WSL

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

# Redis
export redis_host=localhost
export redis_port=6379
export redis_password=
```

Alternatively, configure these values in `application-local.properties` / `application.yml`.

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

```bash
cd frontend-react
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Ensure `BACKEND_BASE_URL` points to:

```text
http://localhost:5001
```

---

## 🐳 Docker Deployment

From the project root:

```bash
docker compose up --build
```

### Services

| Service  | Port Mapping | Description                       |
| -------- | ------------ | --------------------------------- |
| Backend  | 5001:5001    | Spring Boot REST API              |
| Frontend | 5173:80      | React application served by Nginx |
| Redis    | 6379:6379    | Caching layer                     |

### Example Redis service in `docker-compose.yml`

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

1. User registers or logs in.
2. Backend returns an **access token** in the response body.
3. Backend sets a **refresh token** as an HttpOnly cookie.
4. Axios request interceptor attaches:
   ```text
   Authorization: Bearer <accessToken>
   ```
5. On `401`, the Axios response interceptor calls `/api/auth/refresh-token`.
6. The refresh token is sent automatically via the cookie.
7. On success a new access token is issued; on failure the user is logged out.

### Roles

* `USER`
* `ADMIN`

Admin endpoints are protected with:

```java
@PreAuthorize("hasRole('ADMIN')")
```

---

## 📡 Key API Endpoints

### Public / Authentication

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | /api/auth/register        | Register user          |
| POST   | /api/auth/login           | Login                  |
| POST   | /api/auth/refresh-token   | Refresh access token   |
| POST   | /api/auth/logout          | Logout                 |
| POST   | /api/auth/forgot-password | Request password reset |
| POST   | /api/auth/reset-password  | Reset password         |

### Customer

| Method | Endpoint                   | Description                    |
| ------ | -------------------------- | ------------------------------ |
| GET    | /api/foods/all             | Get all foods                  |
| GET    | /api/foods/category/{id}   | Get foods by category          |
| GET    | /api/foods/search?keyword= | Search foods                   |
| POST   | /api/cart/add              | Add item to cart               |
| GET    | /api/cart/{userId}         | Get user's cart                |
| POST   | /api/orders/place          | Place order                    |
| GET    | /api/orders                | Get user's orders              |
| POST   | /api/payment/create-order  | Create Razorpay order          |
| POST   | /api/payment/verify        | Verify payment                 |
| POST   | /api/contact               | Submit contact/support request |

### Admin

All admin APIs live under `/admin/api/...` and require `ROLE_ADMIN`.

---

## 🔴 Redis Caching Strategy

Redis is used via Spring Cache annotations (`@Cacheable`, `@CacheEvict`, `@CachePut`, `@Caching`).

A custom `PageResponse<T>` DTO is returned instead of Spring Data’s `Page` so that Redis serialization works reliably with `GenericJackson2JsonRedisSerializer`.

### Cache Names & Keys

| Cache Name                  | Used In                    | Key Pattern / Notes         | Eviction Triggers                               |
| --------------------------- | -------------------------- | --------------------------- | ----------------------------------------------- |
| foods                       | Food by ID                 | `#id`                       | Update / soft-delete food                       |
| foodList                    | All active foods           | `'all'`                     | Add / update / delete food                      |
| foodsPage                   | Paginated foods            | `pageNumber-pageSize`       | Add / update / delete food                      |
| foodsByCategory             | Foods by category          | `#categoryId`               | Add / update / delete food                      |
| searchFoods                 | Keyword search             | keyword (or `'all'`)        | Add / update / delete food                      |
| category                    | Category by ID / all       | `#id` or `'all'`            | Create / update / soft-delete category          |
| categoryPage                | Paginated categories       | `pageNumber-pageSize`       | Create / update / soft-delete category          |
| cartItems                   | User cart                  | `#userId`                   | Add / increase / decrease / remove / clear cart |
| userOrders                  | User’s order history       | `userId:pageNumber:pageSize`| Place order / update order status               |
| paginatedOrders             | All orders (admin)         | `pageNumber - pageSize`     | Place order / update order status               |
| filteredOrders              | Filtered orders            | `pageNumber:pageSize:keyword`| Place order / update order status              |
| allUsers                    | Paginated users            | `pageNumber - pageSize`     | Add / delete / update / block / unblock user    |
| filteredUser                | User search                | keyword (or `'all'`)        | Add / delete / update / block / unblock user    |
| contactMessagePage          | Paginated contact messages | `pageNumber-pageSize`       | Save / update contact message                   |
| filteredContactMessagePage  | Filtered contact messages  | `pageNumber-pageSize-keyword`| Save / update contact message                  |
| revenueAnalytics            | Last 7 days revenue        | `'last7days'`               | Place order / update order status               |
| orderStatusAnalytics        | Order status distribution  | `'orderStatus'`             | Place order / update order status               |
| orderAnalytics              | Recent orders              | `'lastOrders'`              | Place order / update order status               |
| topSellingAnalytics         | Top-selling foods          | `'topSold'`                 | Place order                                     |
| recentQueryAnalytics        | Recent contact queries     | `'latestQuery'`             | Save / update contact message                   |

### Key Implementation Notes

* **Foods & Categories** – Soft-delete (`active = false`). Cache is evicted on every mutation.
* **Cart** – Per-user cache. Any quantity change or item removal evicts the user’s cart cache.
* **Orders** – Placing an order or changing status clears order lists **and** related analytics caches.
* **Analytics** – Heavily cached because they are expensive aggregates (revenue last 7 days, top-selling foods, etc.).
* **Page serialization** – Spring Data `Page` / `PageImpl` is **not** cached directly. All paginated endpoints return a custom `PageResponse<T>` that serializes cleanly with Jackson + Redis.

### Example Cache Annotations

```java
// Read – cache the result
@Cacheable(value = "foods", key = "#id")
public FoodResponse getFoodById(long id) { ... }

// Write – evict related caches
@Caching(evict = {
    @CacheEvict(value = "foods", key = "#id"),
    @CacheEvict(value = "searchFoods", allEntries = true),
    @CacheEvict(value = "foodsByCategory", allEntries = true),
    @CacheEvict(value = "foodsPage", allEntries = true),
    @CacheEvict(value = "foodList", allEntries = true)
})
public FoodResponse deleteFoodById(long id) { ... }

// Cart – user-scoped
@Cacheable(value = "cartItems", key = "#userId")
public List<CartResponse> getCart(Long userId) { ... }

@CacheEvict(value = "cartItems", key = "#userId")
public void clearCart(Long userId) { ... }
```

---

## 🔧 Configuration Notes

### JWT

* Access tokens are short-lived.
* Refresh tokens live longer and are stored in an HttpOnly cookie.
* Set `Secure=true` on the cookie in production.

### CORS

Allowed development origins:

```text
http://localhost:5173
http://localhost:3000
```

### Cloudinary

Images are uploaded under the folder `ecommerce/photos`.

### Razorpay

Required variables:

```text
razorpay_key
razorpay_secret
razorpay_currency
```

### Email

Gmail SMTP + App Password is used for password-reset emails.

### File Uploads

Maximum size: **50 MB**.

### Redis

```properties
# application.yml / application.properties example
spring.data.redis.host=${redis_host:localhost}
spring.data.redis.port=${redis_port:6379}
spring.data.redis.password=${redis_password:}
spring.cache.type=redis
```

Make sure a Redis instance is running before starting the backend.

---

## 📦 Production Tips

1. **Never commit secrets** – use environment variables or a secrets manager.
2. Enable **HTTPS** in production.
3. Set `Secure=true` for refresh-token cookies.
4. Configure the production domain in CORS.
5. Use a managed MySQL instance.
6. Run Redis (managed or containerized) and monitor memory usage.
7. Add health checks (`/actuator/health`) that include Redis.
8. Add centralized logging and monitoring.
9. Use production Razorpay credentials only after thorough testing.
10. Keep Docker images and dependencies updated.

---

## ❤️ Author

Built with ❤️ using:

**React + Spring Boot + MySQL + Redis + Docker**

---

**Happy Ordering! 🍔🍕**
