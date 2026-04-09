# 🍽️ Mini Restaurant Daily Menu and Order Tracking System

A full-stack restaurant management application built with Spring Boot and React.

---

## 🚀 Tech Stack

**Backend:** Java 17, Spring Boot 3.2, Spring Security (JWT), MongoDB, Maven  
**Frontend:** React 18, TypeScript, Tailwind CSS, Vite  
**Database:** MongoDB (via Docker)

---

## ⚙️ Prerequisites

Make sure the following are installed on your machine:

- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Maven 3.8+](https://maven.apache.org/) (or use the included `mvnw`)

---

## 🗄️ 1. Start MongoDB

Make sure Docker Desktop is running, then:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

> If the container already exists, start it with:
> ```bash
> docker start mongodb
> ```

---

## 🔧 2. Start the Backend

```bash
cd restaurant-api
mvn spring-boot:run
```

The API will start on **http://localhost:8080**

> On first run, 26 default products will be automatically loaded into the database.

Swagger UI is available at: **http://localhost:8080/swagger-ui/index.html**

---

## 💻 3. Start the Frontend

Open a new terminal:

```bash
cd restaurant-frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 👤 Usage

### Getting Started
1. Register a **Customer** account to browse menus and place orders
2. Register a **Restaurant** account to manage menus and orders

### Customer Features
- View today's menu and place orders
- View weekly and monthly menus with month/year filter
- Add/remove items from orders before they are prepared
- Cancel orders
- Request refunds for delivered orders (with item selection)
- Loyalty discount system (5% after 5 orders, 10% after 10, 15% after 20)

### Restaurant Features
- Manage product catalog (add, edit, delete products)
- Create daily menus by selecting from the product catalog
- Edit and delete existing menus
- Update order status (In Progress → Preparing → On The Way → Delivered)
- View refund requests with selected items and reason

---

## 🏗️ Project Structure

```
├── restaurant-api/          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/aselsan/restaurant/
│   │       ├── config/      # Security, Data Initializer
│   │       ├── controller/  # REST Controllers
│   │       ├── service/     # Business Logic
│   │       ├── model/       # MongoDB Documents
│   │       ├── repository/  # Spring Data Repositories
│   │       ├── dto/         # Request/Response DTOs
│   │       ├── security/    # JWT Filter & Utilities
│   │       ├── enums/       # Status & Category Enums
│   │       └── exception/   # Global Exception Handler
│   └── src/test/            # Unit Tests (JUnit 5 + Mockito)
│
└── restaurant-frontend/     # React Frontend
    └── src/
        ├── pages/           # Page Components
        ├── components/      # Shared Components
        ├── services/        # API Service Layer
        ├── context/         # Auth Context
        └── types/           # TypeScript Interfaces
```

---

## 🧪 Running Tests

```bash
cd restaurant-api
mvn test
```

All 9 unit tests should pass.

---

## 📝 Notes

- Both backend and frontend must be running simultaneously
- MongoDB must be running before starting the backend
- Default products are only loaded on the **first** run (when the products collection is empty)
- For testing with two roles simultaneously, use different browsers or one in incognito mode
