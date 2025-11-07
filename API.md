# Nexus Backend API Documentation

## Overview
Nexus is an e-commerce backend API built with Node.js, Express, and SQLite. It provides endpoints for product management, cart operations, and checkout functionality.

**Base URL**: `http://localhost:3001`  
**API Version**: v1  
**Content-Type**: `application/json`

## Response Format
All API responses follow this standard format:

```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "total"?: number,
  "errors"?: array
}
```

## Authentication
Currently, all endpoints are public and do not require authentication.

---

## Products API

### Get All Products
Retrieve all products with pagination support.

**Endpoint**: `GET /api/products`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search products by name or description

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15",
      "description": "Latest iPhone model",
      "price": 999.99,
      "imageUrl": "iphone15.jpg",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ],
  "message": "Products retrieved successfully"
}
```

### Get Product by ID
Retrieve a specific product by its ID.

**Endpoint**: `GET /api/products/:id`

**Parameters**:
- `id` (required): Product ID (integer)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "imageUrl": "iphone15.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Product retrieved successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "data": null,
  "message": "Product not found"
}
```

### Create Product
Create a new product.

**Endpoint**: `POST /api/products`

**Request Body**:
```json
{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "imageUrl": "iphone15.jpg"
}
```

**Validation Rules**:
- `name`: Required, 2-200 characters
- `description`: Required, 10-1000 characters
- `price`: Required, positive number with max 2 decimal places
- `imageUrl`: Optional, valid URL format

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "imageUrl": "iphone15.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "message": "Product created successfully"
}
```

### Update Product
Update an existing product.

**Endpoint**: `PUT /api/products/:id`

**Parameters**:
- `id` (required): Product ID (integer)

**Request Body** (all fields optional):
```json
{
  "name": "iPhone 15 Pro",
  "description": "Updated description",
  "price": 1099.99,
  "imageUrl": "iphone15pro.jpg"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "description": "Updated description",
    "price": 1099.99,
    "imageUrl": "iphone15pro.jpg",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z"
  },
  "message": "Product updated successfully"
}
```

### Delete Product
Delete a product by ID.

**Endpoint**: `DELETE /api/products/:id`

**Parameters**:
- `id` (required): Product ID (integer)

**Response**:
```json
{
  "success": true,
  "data": null,
  "message": "Product deleted successfully"
}
```

---

## Cart API

### Get Cart Items
Retrieve all items in the cart with total calculation.

**Endpoint**: `GET /api/cart`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "productId": 1,
      "qty": 2,
      "subtotal": 1999.98,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
      "productName": "iPhone 15",
      "productDescription": "Latest iPhone model",
      "productPrice": 999.99,
      "productImageUrl": "iphone15.jpg"
    }
  ],
  "total": 1999.98,
  "message": "Cart items retrieved successfully"
}
```

**Empty Cart Response**:
```json
{
  "success": true,
  "data": [],
  "total": 0,
  "message": "Cart is empty"
}
```

### Add Item to Cart
Add a product to cart or increment quantity if it already exists.

**Endpoint**: `POST /api/cart`

**Request Body**:
```json
{
  "productId": 1,
  "qty": 2
}
```

**Validation Rules**:
- `productId`: Required, positive integer
- `qty`: Required, positive integer

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": 1,
    "qty": 2,
    "subtotal": 1999.98,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "productName": "iPhone 15",
    "productDescription": "Latest iPhone model",
    "productPrice": 999.99,
    "productImageUrl": "iphone15.jpg"
  },
  "total": 1999.98,
  "message": "Item added to cart successfully"
}
```

**Error Responses**:
- `400`: Invalid product ID or quantity
- `404`: Product not found

### Update Cart Item
Update the quantity of a cart item.

**Endpoint**: `PUT /api/cart/:id`

**Parameters**:
- `id` (required): Cart item ID (integer)

**Request Body**:
```json
{
  "qty": 3
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": 1,
    "qty": 3,
    "subtotal": 2999.97,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:30:00.000Z",
    "productName": "iPhone 15",
    "productDescription": "Latest iPhone model",
    "productPrice": 999.99,
    "productImageUrl": "iphone15.jpg"
  },
  "total": 2999.97,
  "message": "Cart item updated successfully"
}
```

### Remove Cart Item
Remove a specific item from the cart.

**Endpoint**: `DELETE /api/cart/:id`

**Parameters**:
- `id` (required): Cart item ID (integer)

**Response**:
```json
{
  "success": true,
  "data": null,
  "total": 0,
  "message": "Item removed from cart successfully"
}
```

**Error Response** (404):
```json
{
  "success": false,
  "data": null,
  "total": 0,
  "message": "Cart item not found"
}
```

### Clear Cart
Remove all items from the cart.

**Endpoint**: `DELETE /api/cart`

**Response**:
```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  },
  "total": 0,
  "message": "Cart cleared successfully"
}
```

---

## Checkout API

### Process Checkout
Process a checkout transaction with customer details.

**Endpoint**: `POST /api/checkout`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "cartItems": [
    {
      "productId": 1,
      "qty": 2
    }
  ]
}
```

**Validation Rules**:
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `cartItems`: Optional array for validation (if provided, must match current cart)

**Response** (201):
```json
{
  "success": true,
  "receipt": {
    "receiptId": "RCP-1704110400000-A1B2C3D4",
    "total": 1999.98,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "qty": 2,
        "subtotal": 1999.98,
        "productName": "iPhone 15",
        "productDescription": "Latest iPhone model",
        "productPrice": 999.99,
        "productImageUrl": "iphone15.jpg"
      }
    ]
  },
  "message": "Checkout completed successfully"
}
```

**Error Responses**:
- `400`: Validation failed, cart is empty, or cart items mismatch
- `500`: Checkout processing failed

### Get Receipt
Retrieve a receipt by receipt ID.

**Endpoint**: `GET /api/checkout/receipt/:receiptId`

**Parameters**:
- `receiptId` (required): Receipt ID (string)

**Response**:
```json
{
  "success": true,
  "receipt": {
    "receiptId": "RCP-1704110400000-A1B2C3D4",
    "total": 1999.98,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "qty": 2,
        "subtotal": 1999.98,
        "productName": "iPhone 15",
        "productDescription": "Latest iPhone model",
        "productPrice": 999.99,
        "productImageUrl": "iphone15.jpg"
      }
    ]
  },
  "message": "Receipt retrieved successfully"
}
```

### Get All Receipts
Retrieve all receipts (admin functionality).

**Endpoint**: `GET /api/checkout/receipts`

**Response**:
```json
{
  "success": true,
  "receipts": [
    {
      "receiptId": "RCP-1704110400000-A1B2C3D4",
      "total": 1999.98,
      "timestamp": "2024-01-01T12:00:00.000Z",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "itemsCount": 1
    }
  ],
  "message": "Receipts retrieved successfully"
}
```

---

## Error Handling

### Common Error Responses

**Validation Error** (400):
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "email",
      "message": "Valid email address is required"
    }
  ]
}
```

**Not Found** (404):
```json
{
  "success": false,
  "data": null,
  "message": "Resource not found"
}
```

**Internal Server Error** (500):
```json
{
  "success": false,
  "data": null,
  "message": "Internal server error"
}
```

### Error Codes
- `400`: Bad Request - Invalid request data or validation failure
- `404`: Not Found - Resource does not exist
- `500`: Internal Server Error - Server-side error

---

## Database Schema

### Products Table
```sql
CREATE TABLE Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    imageUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### CartItems Table
```sql
CREATE TABLE CartItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    qty INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES Products (id)
);
```

### Receipts Table
```sql
CREATE TABLE Receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receiptId TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    total REAL NOT NULL,
    cartItems TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testing

### Postman Collection
Import the provided Postman collection for comprehensive API testing.

### Test Data
Use the following test data for API testing:

**Sample Product**:
```json
{
  "name": "iPhone 15",
  "description": "Latest iPhone model with advanced features",
  "price": 999.99,
  "imageUrl": "https://example.com/iphone15.jpg"
}
```

**Sample Cart Item**:
```json
{
  "productId": 1,
  "qty": 2
}
```

**Sample Checkout**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

---

## Architecture

### Project Structure
```
backend/
├── src/
│   ├── config/         # Database and app configuration
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── tests/          # Unit and integration tests
│   ├── app.js         # Express app configuration
│   └── server.js      # Server startup
├── database/           # SQLite database files
└── package.json
```

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Validation**: Joi, express-validator
- **Testing**: Jest, Supertest
- **UUID Generation**: uuid package

---

## Development

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Start production server
npm start
```

### Environment Variables
```env
NODE_ENV=development
PORT=3000
DB_PATH=./database/nexus.db
```

---

## Changelog

### v1.0.0
- Initial release with Products, Cart, and Checkout APIs
- SQLite database integration
- Comprehensive validation and error handling
- Full test coverage
- Transaction support for data consistency
