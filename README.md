# 🎲 7 Up Down - Dice Betting Game API (Node.js + MySQL)

This is a RESTful API for a dice-based betting game built using **Node.js**, **Express**, and **MySQL**. Users can register, log in, and place bets on whether the total of two rolled dice will be **greater than 7 (UP)**, **less than 7 (DOWN)**, or **exactly 7 (SEVEN)**.

---

## 🚀 Features

- 🔐 JWT-based authentication
- 👤 User signup and login
- 🎲 Bet logic with dice rolling and payout calculation
- 💸 User balance management
- 📈 Bet history
- 📦 MySQL + Connection Pooling
- 🔐 Secured with Helmet & CORS

---

## 🧑‍💻 Tech Stack

- Node.js
- Express.js
- MySQL
- JWT for auth
- Bcrypt for password hashing
- dotenv, helmet, cors

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourname/7updown-api.git
cd 7updown-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup `.env` file

```env
PORT=8001
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=7updown
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 4. Import SQL Tables

Run these in your MySQL database:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(10,2) DEFAULT 1000.00,
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_bets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  betAmount DECIMAL(10,2) NOT NULL,
  betType ENUM('UP', 'DOWN', 'SEVEN') NOT NULL,
  dice1 INT NOT NULL,
  dice2 INT NOT NULL,
  total INT NOT NULL,
  result ENUM('UP', 'DOWN', 'SEVEN') NOT NULL,
  isWin BOOLEAN,
  payout DECIMAL(10,2),
  betDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
```

---

## 🧪 API Endpoints

### 🔐 Auth

- `POST /api/v1/users/signup`  
  Register new user

- `POST /api/v1/users/signin`  
  Login & receive JWT token

### 🎲 Bets

- `POST /api/v1/bets/placebet`  
  Place a bet (requires JWT)

- `GET /api/v1/bets/getbethistory`  
  View user’s bet history (requires JWT)

> Use Bearer token in `Authorization` header for all /bets endpoints.

---

## 🔐 Security

- Helmet for setting secure HTTP headers
- CORS enabled
- JWT authentication middleware
- Bcrypt for hashed passwords

---

## 🧼 Project Structure

```
project-root/
├── controllers/
│   └── userController.js
│   └── betController.js
├── routes/
│   └── indexRoute.js
│   └── userRoutes.js
│   └── betRoutes.js
├── middleware/
│   └── isAuth.js
├── utils/
│   └── responseHelper.js
├── common/
│   └── constant.js
├── configuration/
│   └── dbConfig.js
├── models/
│   └── queryHelper.js
├── app.js
├── .env
└── README.md
```

---

## ✅ Future Enhancements

- Betting leaderboard
- Admin panel
- Game statistics API
- Win ratio tracking

---

## 🔗 Postman Collection

You can test all the API endpoints using the shared Postman collection:

👉 [Click here to open in Postman](https://universal-escape-919983.postman.co/workspace/My-Workspace~ea087cbe-8d8c-4499-849b-a826904a27ef/collection/15539597-ed481191-84ef-4d04-b4db-64f75ff49a1b?action=share&creator=15539597)


## 🧑‍💻 Author

Made with ❤️ by Salib Shekh

---

## 📜 License

MIT