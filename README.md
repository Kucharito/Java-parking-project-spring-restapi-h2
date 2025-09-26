# 🚗 Java Spring Parking – REST API

This project demonstrates a simple **Spring Boot REST API** for managing a parking garage system.  
It provides endpoints for creating and managing **parking spots, reservations, and check-in/check-out** processes.  
The application was created as part of a university project and serves as a demonstration of **CRUD operations** in a backend service.

---

## ⚙️ Tech stack
- Java 21
- Spring Boot 3.2 (Spring Web, Spring Data JPA, Hibernate)
- H2 in-memory database (with H2 console)
- Maven – build & dependency management
- Lombok

---

👉 This is the main project you need to open in IntelliJ IDEA or run with Maven (`mvn spring-boot:run`).  
👉 A simple frontend (React/HTML) is **planned – TODO**.

---

## 🚀 Running the project

1. **Clone the repository**

2. **Run with Maven**
    ```bash
    mvn spring-boot:run
    ```
    or open in IntelliJ IDEA and run JavaParkingSpringApplication.java.

3. **Access the app**
- REST API: http://localhost:8081
- H2 console: http://localhost:8081/h2
    ```bash
    JDBC URL: jdbc:h2:mem:testdb
    User: sa
    Password: (leave empty)
    ```
## 🗄️ Database schema (auto-generated)

### Garage
- `id`
- `name` (garage name)

### ParkingSpot
- `id`
- `is_occupied` 
- `number` (spot number)
- `status` (FREE / OCCUPIED)
- `garage_id` (reference to Garage)

### Reservation
- `id`
- `spot_id` (reference to ParkingSpot)
- `licensePlate`
- `startTime`
- `endTime`
- `status` (CREATED / CHECKED_IN / COMPLETED)

---

## 🌍 REST API Endpoints

### Garages
| Method | Endpoint               | Description                |
|--------|-------------------------|----------------------------|
| GET    | `/api/garages`         | Get all garages            |
| GET    | `/api/garages/{id}`    | Get garage by ID           |
| POST   | `/api/garages`         | Create new garage          |
| PUT    | `/api/garages/{id}`    | Update existing garage (**TODO**) |
| DELETE | `/api/garages/{id}`    | Delete garage (**TODO**)   |

### Parking Spots
| Method | Endpoint                 | Description          |
|--------|---------------------------|----------------------|
| GET    | `/api/spots`             | Get all parking spots |
| GET    | `/api/spots/{id}`        | Get spot by ID       |
| POST   | `/api/spots`             | Create new spot      |
| PUT    | `/api/spots/{id}`        | Update existing spot (**TODO**) |
| DELETE | `/api/spots/{id}`        | Delete spot (**TODO**) |

### Reservations
| Method | Endpoint                    | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/reservations`         | Get all reservations      |
| GET    | `/api/reservations/{id}`    | Get reservation by ID     |
| POST   | `/api/reservations`         | Create new reservation    |
| PUT    | `/api/reservations/{id}`    | Update existing reservation (**TODO**) |
| DELETE | `/api/reservations/{id}`    | Delete reservation (**TODO**) |
| POST   | `/api/reservations/{id}/checkin`  | Check in to reservation  |
| POST   | `/api/reservations/{id}/checkout` | Check out of reservation |


## 📑 Example requests (Postman / curl)

### 🏢 Garages

#### ➕ Create a garage
```bash
curl -X POST "http://localhost:8081/api/garages?name=Downtown" \
  -H "accept: */*" \
  -d ''
```

## 📋 Get all garages
```bash
curl -X GET "http://localhost:8081/api/garages" -H "accept: */*"
```

### 🅿️ Parking Spots
## Create a parking spot

```
curl -X POST "http://localhost:8081/api/parkingspots?garageId=1&spotNumber=A1&type=LARGE" \
  -H "accept: */*" \
  -d ''
```
## 📋 Get all parking spots
curl -X GET "http://localhost:8081/api/parkingspots" -H "accept: */*"


## 📅 Reservations
Create a reservation
```bash
curl -X POST "http://localhost:8081/api/reservations" \
  -H "accept: */*" \
  -H "Content-Type: application/json" \
  -d '{
    "spotId": 1,
    "licensePlate": "BA123XY",
    "startTime": "2025-09-21T08:00:00Z",
    "endTime": "2025-09-21T10:00:00Z"
  }'

```
## ✅ Check in
curl -X POST "http://localhost:8081/api/reservations/1/check-in?now=2025-09-21T08:00:00Z" \
  -H "accept: */*" \
  -d ''

## 🏁 Check out
```bash
curl -X POST "http://localhost:8081/api/reservations/1/check-out?now=2025-09-21T10:00:00Z" \
  -H "accept: */*" \
  -d ''

```

## 📋 Get reservation by ID
```bash 
curl -X GET "http://localhost:8081/api/reservations/1" -H "accept: */*"

```

## ❌ Delete reservation
```bash
curl -X DELETE "http://localhost:8081/api/reservations/1" -H "accept: */*"
```



### TODOs 
- Implement DELETE endpoints for garages, spots, and reservations
- Implement UPDATE endpoints (PUT)
- Add simple **frontend** for interaction with REST API


### 🧑‍💻 Author
Created by Adam Kuchár


