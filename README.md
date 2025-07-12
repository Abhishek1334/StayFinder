
# StayFinder

A full-stack web application inspired by Airbnb. StayFinder allows users to list, search, and book properties for short-term or long-term stays. The project demonstrates end-to-end development skills across frontend, backend, and database layers.

*Live Demo:* [https://stayfinder-eta.vercel.app/](https://stayfinder-eta.vercel.app/)  
*Portfolio:* [https://abhishek-rajoria.vercel.app/](https://abhishek-rajoria.vercel.app/)
---

## � Features

### User-Facing
- **Homepage:** Browse property cards with images, location, and price.
- **Property Details:** View images, descriptions, amenities, and availability calendar.
- **Search & Filters:** Find listings by location, price, and date.
- **Authentication:** Register and login with validation.
- **Booking:** Reserve properties with a simple booking flow.
- **Profile:** View and manage your bookings.

### Host/Owner
- **Host Dashboard:** Manage your own listings.
- **Listing CRUD:** Create, edit, and delete property listings.

### Backend/API
- **RESTful Endpoints:** For listings, bookings, and authentication.
- **Database Models:** Users, Listings, Bookings.

### Bonus
- **Mock Payment Integration:** (e.g., Stripe)
- **Modern UI/UX:** Inspired by Airbnb, NomadX, and Dribbble designs.

---

## 🛠️ Tech Stack

| Layer      | Technology                | Why?                                                                 |
|------------|---------------------------|----------------------------------------------------------------------|
| Frontend   | React + TypeScript, Vite  | Fast, type-safe, component-driven UI                                 |
| Styling    | Tailwind CSS              | Utility-first, rapid styling                                         |
| State      | Redux Toolkit             | Predictable, scalable state management                               |
| Backend    | Node.js, Express          | Robust, widely-used for REST APIs                                    |
| Database   | MongoDB (Mongoose)        | Flexible, JSON-like, easy to seed/test                               |
| Auth       | JWT, bcrypt               | Secure, stateless authentication                                     |
| Hosting    | Vercel (frontend), Render (backend) | Simple, scalable deployment                                 |
---

## 📦 Project Structure

```
StayFinder/
  client/      # React frontend (Vite, Tailwind, Redux)
  server/      # Node.js/Express backend (MongoDB, Mongoose)
```

- See `/client/README.md` and `/server/README.md` for more details.

---

## 🧠 Assignment Reflections

### Tech Stack Choice

- **React + TypeScript:** For type safety, scalability, and a modern developer experience.
- **Node.js/Express:** Fast prototyping, large ecosystem, and easy integration with MongoDB.
- **MongoDB:** Flexible schema, ideal for rapid development and prototyping.

### Full-Stack Comfort

> Yes, I am comfortable building both frontend and backend if UI is provided. I enjoy working across the stack and can quickly adapt to new UI/UX requirements.

### Unique Features to Improve Airbnb

1. **Instant Messaging:** Real-time chat between guests and hosts for faster communication.
2. **Dynamic Pricing Engine:** Suggest optimal prices to hosts based on demand, seasonality, and local events.

### Security & Scalability

- **Security:** JWT-based authentication, password hashing (bcrypt), input validation, and secure HTTP headers.
- **Scaling:** Stateless backend (easy to scale horizontally), CDN for static assets, and cloud database (MongoDB Atlas) for high availability.

---

## 📄 API Overview

- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`
- **Listings:** `GET /api/listings`, `GET /api/listings/:id`, `POST /api/listings` (host), `PUT/PATCH/DELETE /api/listings/:id`
- **Bookings:** `POST /api/bookings`, `GET /api/bookings` (user/host)
- **Payments:** (Mock/Stripe integration)

See [`API_DOCS.md`](./API_DOCS.md) for full documentation.

-

## 🎨 UI/UX Inspiration

- Airbnb, NomadX, Dribbble, Figma community designs.

---

## 🌍 Deployment

- **Frontend:** [Vercel](https://vercel.com/)
- **Backend:** [Render](https://render.com/)

---

## �� Acknowledgements

- [Airbnb](https://airbnb.com) for inspiration
- [Dribbble](https://dribbble.com/) & [Figma](https://figma.com/) for UI ideas

---

## 📫 Contact

For questions or feedback, please open an issue or contact [your-email@example.com].

---

**_Thank you for reviewing StayFinder!_**

---

## 🔗 Portfolio

Check out my portfolio at [https://abhishek-rajoria.vercel.app/](https://abhishek-rajoria.vercel.app/).

