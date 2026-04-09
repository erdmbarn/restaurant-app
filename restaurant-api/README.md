# 🍽️ Restaurant API

Mini Restaurant Daily Menu and Order Tracking System — Aselsan Case Study

## Tech Stack

- **Java 17** + **Spring Boot 3.2**
- **MongoDB** (NoSQL)
- **Spring Security** + **JWT**
- **Swagger / OpenAPI 3**
- **Docker** + **Docker Compose**

## Quick Start

### With Docker Compose (Recommended)
```bash
docker-compose up -d
```
API runs at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Local Development
```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7.0

# Run the app
./mvnw spring-boot:run
```

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register (CUSTOMER or RESTAURANT) |
| POST | `/api/auth/login` | Login, get JWT token |

### Menu
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/api/menus/today` | Any | Today's menu |
| GET | `/api/menus/week` | Any | Weekly menus |
| GET | `/api/menus/month` | Any | Monthly menus |
| POST | `/api/menus` | RESTAURANT | Create menu |
| PUT | `/api/menus/{id}` | RESTAURANT | Update menu |

### Order
| Method | Path | Role | Description |
|--------|------|------|-------------|
| POST | `/api/orders` | CUSTOMER | Create order |
| GET | `/api/orders/my` | CUSTOMER | My orders |
| GET | `/api/orders` | RESTAURANT | All orders |
| POST | `/api/orders/{id}/items` | CUSTOMER | Add item |
| DELETE | `/api/orders/{id}/items/{itemId}` | CUSTOMER | Remove item |
| PATCH | `/api/orders/{id}/status` | RESTAURANT | Update status |
| POST | `/api/orders/{id}/refund` | CUSTOMER | Request refund |

## Running Tests
```bash
./mvnw test
```

## Project Structure
```
src/
├── main/java/com/aselsan/restaurant/
│   ├── config/          # Security, OpenAPI config
│   ├── controller/      # REST controllers
│   ├── dto/             # Request/Response DTOs
│   ├── enums/           # OrderStatus, UserRole, MenuCategory
│   ├── exception/       # Global error handling
│   ├── model/           # MongoDB documents
│   ├── repository/      # Data access layer
│   ├── security/        # JWT filter & utility
│   └── service/         # Business logic
└── test/                # Unit tests (JUnit5 + Mockito)
```
