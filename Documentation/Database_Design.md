# SkillPro -- Database Design

## Introduction

This document defines the database structure of the SkillPro
application. It explains what collections will be created, how they are
related, what fields they contain, and the validation rules that should
be followed.

The database is designed to be simple, scalable, and easy to maintain.

------------------------------------------------------------------------

# 1. Database

**Database:** MongoDB

**ODM:** Mongoose

MongoDB is used because it stores data in flexible JSON-like documents,
making it a good choice for MERN stack applications.

------------------------------------------------------------------------

# 2. Collections

The application will contain the following collections:

1.  Users
2.  ProfessionalProfiles
3.  Categories
4.  Services
5.  Bookings
6.  Reviews
7.  Messages
8.  Notifications

------------------------------------------------------------------------

# 3. Entity Relationship Overview

Customer (User) │ │ Books ▼ Booking ▲ ▲ │ │ Professional Service │ ▼
Professional Profile │ ▼ Reviews

------------------------------------------------------------------------

# 4. Collection Details

## Users

Stores information about every user.

  Field       Type       Description
  ----------- ---------- ---------------------------------
  \_id        ObjectId   Unique ID
  name        String     Full name
  email       String     User email
  password    String     Encrypted password
  phone       String     Contact number
  role        String     customer / professional / admin
  avatar      String     Profile image
  city        String     User city
  createdAt   Date       Created date
  updatedAt   Date       Last updated

------------------------------------------------------------------------

## ProfessionalProfiles

Stores additional information for professionals.

  Field           Type
  --------------- ----------
  userId          ObjectId
  bio             String
  skills          Array
  experience      Number
  certificates    Array
  portfolio       Array
  isVerified      Boolean
  averageRating   Number

------------------------------------------------------------------------

## Categories

  Field         Type
  ------------- --------
  name          String
  icon          String
  description   String

Examples: - Driver - Plumber - Electrician - Mechanic - Software
Developer

------------------------------------------------------------------------

## Services

  Field            Type
  ---------------- ----------
  title            String
  description      String
  categoryId       ObjectId
  professionalId   ObjectId
  price            Number
  images           Array
  availability     Boolean

------------------------------------------------------------------------

## Bookings

  Field            Type
  ---------------- ----------
  customerId       ObjectId
  professionalId   ObjectId
  serviceId        ObjectId
  bookingDate      Date
  status           String
  paymentStatus    String

Status values: - Pending - Accepted - Rejected - Completed - Cancelled

------------------------------------------------------------------------

## Reviews

  Field            Type
  ---------------- ----------
  bookingId        ObjectId
  customerId       ObjectId
  professionalId   ObjectId
  rating           Number
  comment          String
  createdAt        Date

------------------------------------------------------------------------

## Messages

  Field        Type
  ------------ ----------
  senderId     ObjectId
  receiverId   ObjectId
  message      String
  sentAt       Date

------------------------------------------------------------------------

## Notifications

  Field       Type
  ----------- ----------
  userId      ObjectId
  title       String
  message     String
  isRead      Boolean
  createdAt   Date

------------------------------------------------------------------------

# 5. Relationships

-   One User can create one Professional Profile.
-   One Professional can offer many Services.
-   One Customer can create many Bookings.
-   One Booking belongs to one Service.
-   One Booking can have one Review.
-   One Professional can receive many Reviews.
-   One User can send and receive many Messages.

------------------------------------------------------------------------

# 6. Validation Rules

### Users

-   Email must be unique.
-   Password must contain at least 8 characters.
-   Name is required.

### Services

-   Price must be greater than 0.
-   Title is required.
-   Category is required.

### Reviews

-   Rating must be between 1 and 5.
-   Review can only be submitted after service completion.

------------------------------------------------------------------------

# 7. Indexes

Recommended indexes:

-   email
-   city
-   role
-   categoryId
-   professionalId

These indexes will improve search performance.

------------------------------------------------------------------------

# 8. Future Database Improvements

Future versions may include:

-   Wallet collection
-   Payment collection
-   Coupons
-   Favorite Services
-   Saved Professionals
-   AI Recommendations

------------------------------------------------------------------------

# Conclusion

This database design provides a strong foundation for SkillPro. It
clearly defines the collections, relationships, fields, and validation
rules. After finalizing this document, the next step will be designing
the REST APIs and then implementing the backend using Express, MongoDB,
and Mongoose.
