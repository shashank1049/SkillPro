# SkillPro – Software Requirement Specification (SRS)

## 1. Introduction

### Project Name

**SkillPro**

### Project Overview

SkillPro is a full-stack MERN web application that connects customers with skilled professionals. It allows people to find, compare, and hire professionals such as drivers, plumbers, electricians, mechanics, software developers, tutors, photographers, and many other service providers.

The main purpose of this project is to make hiring skilled professionals simple, secure, and reliable through one online platform.

---

# 2. Purpose

The purpose of SkillPro is to solve the problem of finding trusted professionals for different services.

Currently, people mostly depend on personal contacts, local shops, or WhatsApp groups to hire professionals. This process is slow and there is no proper verification, booking system, or customer feedback.

SkillPro will provide one platform where customers can easily search, compare, and book verified professionals.

---

# 3. Project Scope

The first version (MVP) of SkillPro will include all the essential features required for a service marketplace.

Customers will be able to:

* Register and Login
* Search professionals
* View professional profiles
* Book services
* View booking history
* Give ratings and reviews

Professionals will be able to:

* Register as a professional
* Complete their profile
* Add services
* Manage bookings
* Update availability

The Admin will be able to:

* Verify professionals
* Manage users
* Manage services
* Monitor platform activities

Future versions will include online payments, live chat, notifications, maps, and AI-powered search.

---

# 4. Users of the System

The system has three types of users.

## Customer

A customer is someone who wants to hire a professional for a specific service.

### Customer can:

* Create an account
* Login securely
* Search services
* Book professionals
* Give ratings and reviews
* Manage profile

---

## Professional

A professional is someone who provides one or more services.

### Professional can:

* Create a professional profile
* Add skills and experience
* Create service listings
* Accept or reject bookings
* Manage availability
* View customer reviews

---

## Admin

The admin manages the entire platform.

### Admin can:

* Verify professional accounts
* Manage customers
* Manage services
* Remove fake accounts
* View reports and analytics

---

# 5. Functional Requirements

The application must provide the following features.

### Authentication

* User Registration
* User Login
* Secure Logout
* Password Encryption
* JWT Authentication

---

### Customer Module

* Search professionals
* Filter services
* View profiles
* Book services
* Cancel bookings
* View booking history
* Submit reviews

---

### Professional Module

* Create profile
* Add services
* Edit services
* Manage bookings
* Update availability
* View earnings (future)

---

### Admin Module

* Verify professionals
* Manage users
* Manage services
* View booking reports

---

# 6. Non-Functional Requirements

The application should also meet the following quality requirements.

### Security

* Passwords should be encrypted.
* JWT authentication should be used.
* Protected routes should prevent unauthorized access.

### Performance

* Pages should load quickly.
* API responses should be fast.
* Search should work efficiently.

### Usability

* Easy to use interface.
* Mobile responsive design.
* Simple navigation.

### Scalability

The application should be designed in a way that allows new features to be added easily in the future.

---

# 7. Technologies Used

## Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JWT
* bcrypt

## File Upload

* Cloudinary

## Deployment

* Vercel
* Render
* MongoDB Atlas

---

# 8. Assumptions

The project assumes that:

* Users have an internet connection.
* Professionals provide correct information.
* Admin verifies professionals before they become publicly visible.
* Customers provide genuine ratings and reviews.

---

# 9. Limitations

The first version of SkillPro will have some limitations.

* Online payment will not be included initially.
* Live chat will be added later.
* GPS tracking will not be available in Version 1.
* Mobile application is not included.

---

# 10. Future Enhancements

The following features can be added in future versions.

* Razorpay Payment Integration
* Real-time Chat
* Push Notifications
* Google Maps
* AI Search Assistant
* Email Verification
* OTP Login
* Nearby Professionals
* Wallet System
* Subscription Plans

---

# 11. Success Criteria

The project will be considered successful if:

* Users can register and log in successfully.
* Professionals can create profiles and list services.
* Customers can search and book professionals.
* Reviews and ratings work properly.
* Admin can manage and verify professionals.
* The application works smoothly on desktop and mobile devices.

---

# 12. Conclusion

SkillPro is designed to solve the real-life problem of finding trusted skilled professionals. By providing a secure and user-friendly platform, it helps customers hire professionals with confidence while giving service providers an opportunity to grow their business online.

This SRS document provides a clear understanding of the project's goals, features, and requirements. It will serve as the foundation for designing the database, developing APIs, building the frontend and backend, and deploying the final application.
