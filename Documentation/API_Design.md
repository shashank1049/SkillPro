# SkillPro -- API Design Documentation

## Introduction

This document defines all REST APIs required for the SkillPro
application. It serves as a blueprint for backend development and helps
frontend developers understand how to communicate with the server.

**Base URL**

    http://localhost:8000/api/v1

------------------------------------------------------------------------

# API Standards

## HTTP Methods

  Method   Purpose
  -------- -----------------------
  GET      Fetch data
  POST     Create new data
  PUT      Replace existing data
  PATCH    Update existing data
  DELETE   Delete data

------------------------------------------------------------------------

# Authentication APIs

## Register

**POST** `/auth/register`

Purpose: Create a new customer or professional account.

------------------------------------------------------------------------

## Login

**POST** `/auth/login`

Purpose: Authenticate the user and generate JWT tokens.

------------------------------------------------------------------------

## Logout

**POST** `/auth/logout`

Purpose: Log out the current user.

------------------------------------------------------------------------

## Refresh Token

**POST** `/auth/refresh-token`

Purpose: Generate a new access token using the refresh token.

------------------------------------------------------------------------

## Current User

**GET** `/auth/me`

Purpose: Return the logged-in user's profile.

------------------------------------------------------------------------

# User APIs

## Get Profile

**GET** `/users/profile`

------------------------------------------------------------------------

## Update Profile

**PATCH** `/users/profile`

------------------------------------------------------------------------

# Professional APIs

## Create Professional Profile

**POST** `/professionals`

------------------------------------------------------------------------

## Get All Professionals

**GET** `/professionals`

Supports: - Search - Category filter - City filter - Rating filter

------------------------------------------------------------------------

## Get Professional Details

**GET** `/professionals/:id`

------------------------------------------------------------------------

## Update Professional Profile

**PATCH** `/professionals/:id`

------------------------------------------------------------------------

# Category APIs

## Get Categories

**GET** `/categories`

------------------------------------------------------------------------

# Service APIs

## Add Service

**POST** `/services`

------------------------------------------------------------------------

## Get All Services

**GET** `/services`

Supports filtering by: - Category - Price - City - Search keyword

------------------------------------------------------------------------

## Get Single Service

**GET** `/services/:id`

------------------------------------------------------------------------

## Update Service

**PATCH** `/services/:id`

------------------------------------------------------------------------

## Delete Service

**DELETE** `/services/:id`

------------------------------------------------------------------------

# Booking APIs

## Create Booking

**POST** `/bookings`

------------------------------------------------------------------------

## Get My Bookings

**GET** `/bookings`

------------------------------------------------------------------------

## Booking Details

**GET** `/bookings/:id`

------------------------------------------------------------------------

## Update Booking Status

**PATCH** `/bookings/:id/status`

Possible status values: - Pending - Accepted - Rejected - Completed -
Cancelled

------------------------------------------------------------------------

# Review APIs

## Add Review

**POST** `/reviews`

Only customers with completed bookings can submit reviews.

------------------------------------------------------------------------

## Get Reviews

**GET** `/reviews/:professionalId`

------------------------------------------------------------------------

# Notification APIs

## Get Notifications

**GET** `/notifications`

------------------------------------------------------------------------

## Mark Notification as Read

**PATCH** `/notifications/:id`

------------------------------------------------------------------------

# Message APIs (Future)

## Send Message

**POST** `/messages`

------------------------------------------------------------------------

## Get Conversation

**GET** `/messages/:userId`

------------------------------------------------------------------------

# Common Response Format

## Success Response

``` json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

## Error Response

``` json
{
  "success": false,
  "message": "Something went wrong"
}
```

------------------------------------------------------------------------

# HTTP Status Codes

  Code   Meaning
  ------ -----------------------
  200    OK
  201    Created
  400    Bad Request
  401    Unauthorized
  403    Forbidden
  404    Not Found
  500    Internal Server Error

------------------------------------------------------------------------

# Authentication Flow

1.  User registers.
2.  User logs in.
3.  Server generates JWT access and refresh tokens.
4.  Protected APIs require a valid access token.
5.  Refresh token is used to obtain a new access token when needed.

------------------------------------------------------------------------

# Development Order

1.  Authentication APIs
2.  User APIs
3.  Professional APIs
4.  Category APIs
5.  Service APIs
6.  Booking APIs
7.  Review APIs
8.  Notification APIs
9.  Message APIs

------------------------------------------------------------------------

# Conclusion

This API design document defines the endpoints required for the SkillPro
backend. It provides a clear structure for implementing the Express
routes, controllers, middleware, and frontend integration. Once these
APIs are implemented, the application will have a complete backend
foundation.
