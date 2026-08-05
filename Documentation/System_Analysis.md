# SkillPro -- System Analysis

## Introduction

This document explains how different users will interact with the
SkillPro platform. It defines the responsibilities of each user, the
overall application flow, important business rules, and the pages
required in the system.

The purpose of this document is to ensure that every feature is clearly
planned before development begins.

------------------------------------------------------------------------

# 1. User Roles

SkillPro has three main user roles.

## Customer

A customer is a user who wants to hire a professional for a particular
service.

### Responsibilities

-   Register and login
-   Search professionals
-   Filter services
-   View professional profiles
-   Book services
-   Track bookings
-   Cancel pending bookings
-   Submit ratings and reviews
-   Manage personal profile

------------------------------------------------------------------------

## Professional

A professional is a person who provides one or more services.

### Responsibilities

-   Register as a professional
-   Complete profile
-   Add skills and experience
-   Create service listings
-   Update pricing
-   Accept or reject bookings
-   Mark services as completed
-   Manage availability

------------------------------------------------------------------------

## Admin

The admin manages the entire platform and ensures that everything works
smoothly.

### Responsibilities

-   Verify professional accounts
-   Manage users
-   Manage services
-   Remove fake or inactive accounts
-   Monitor bookings
-   View reports and analytics

------------------------------------------------------------------------

# 2. Use Cases

## Customer Use Cases

-   Register
-   Login
-   Search Services
-   Apply Filters
-   View Professional Profile
-   Book Service
-   View Booking History
-   Cancel Booking
-   Submit Review
-   Update Profile
-   Logout

------------------------------------------------------------------------

## Professional Use Cases

-   Register
-   Login
-   Complete Profile
-   Add Service
-   Edit Service
-   Delete Service
-   Receive Booking Request
-   Accept or Reject Booking
-   Update Availability
-   Complete Service
-   Logout

------------------------------------------------------------------------

## Admin Use Cases

-   Login
-   Verify Professionals
-   Manage Users
-   Manage Services
-   View Reports
-   Suspend Accounts
-   Logout

------------------------------------------------------------------------

# 3. User Journey

## Customer Journey

Home Page

↓

Register / Login

↓

Search Services

↓

Apply Filters

↓

View Professional Profile

↓

Book Service

↓

Booking Confirmation

↓

Service Completed

↓

Submit Review

------------------------------------------------------------------------

## Professional Journey

Register

↓

Complete Profile

↓

Wait for Admin Verification

↓

Add Services

↓

Receive Booking Request

↓

Accept / Reject Booking

↓

Complete Service

↓

Receive Rating

------------------------------------------------------------------------

## Admin Journey

Login

↓

Dashboard

↓

Verify Professionals

↓

Manage Users & Services

↓

View Reports

↓

Logout

------------------------------------------------------------------------

# 4. Navigation Flow

Landing Page

↓

Authentication

↓

Dashboard

↓

Services

↓

Professional Profile

↓

Booking

↓

Booking Success

↓

Review

------------------------------------------------------------------------

# 5. Pages Required

## Public Pages

-   Home
-   About
-   Services
-   Contact
-   Login
-   Register

## Customer Pages

-   Dashboard
-   Search
-   Professional Details
-   Booking History
-   Reviews
-   Profile

## Professional Pages

-   Dashboard
-   My Profile
-   My Services
-   Add Service
-   Bookings
-   Availability

## Admin Pages

-   Admin Dashboard
-   Users
-   Professionals
-   Services
-   Reports

------------------------------------------------------------------------

# 6. Business Rules

-   Every professional must be verified by the admin before becoming
    visible.
-   Customers can only review a completed booking.
-   One booking is linked to one professional.
-   Pending bookings can be cancelled by the customer.
-   Admin has permission to suspend any account violating platform
    rules.

------------------------------------------------------------------------

# 7. Assumptions

-   Every user has a valid email address.
-   Professionals provide genuine information.
-   Customers give honest ratings and reviews.
-   Internet connection is available while using the application.

------------------------------------------------------------------------

# 8. Conclusion

This System Analysis document defines the behavior of all users, their
responsibilities, application flow, and business rules. It provides a
clear understanding of how the platform should work and acts as a bridge
between planning and database design. After completing this document,
the next step is to design the database (ER Diagram and Schema).
