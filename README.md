# RoomEase

RoomEase is a full-stack rental platform built for students and working professionals who need a simpler way to discover rooms, compare options, and contact owners. It also gives property owners a clean workflow to publish listings, manage availability, and respond to tenant interest.

The project solves a real-world room-hunting problem by combining searchable rental listings, role-based access, inquiry management, wishlists, and tenant reviews in one application.

## Why This Project Is Useful

Finding rental rooms often involves scattered listings, incomplete pricing details, and slow communication between owners and tenants. RoomEase brings those workflows into a single platform so tenants can shortlist rooms faster and owners can manage demand more efficiently.

## Key Highlights

- Role-based platform for both tenants and owners
- Full listing lifecycle with create, read, update, and delete operations
- Secure authentication with persistent sessions
- Image upload workflow using Cloudinary
- Real-world rental filters for budget, room type, furnishing, and availability
- Tenant engagement features including wishlist, inquiries, and reviews
- Vercel-ready deployment setup with a serverless entry point

## Features

- User authentication with signup, login, logout, and session persistence
- Role-based authorization for `owner` and `tenant` accounts
- Owners can create, edit, and delete room listings
- Tenants can browse listings and view detailed room pages
- Advanced room filtering by city, min/max rent, room type, furnishing, gender preference, and availability
- Cloudinary-based image upload for room listings
- Tenant wishlist to save and revisit shortlisted rooms
- Inquiry system for tenants to contact owners directly from a listing page
- Review and rating system for tenant feedback
- Input validation with Joi for listings, reviews, and inquiries
- Flash messages for success and error feedback
- Responsive EJS-based UI with Bootstrap styling
- Dark/light theme toggle and password visibility toggle for better UX

## Tech Stack

### Frontend

- EJS
- HTML5
- CSS3
- Bootstrap 5
- Font Awesome

### Backend

- Node.js
- Express.js
- Passport.js
- Express Session

### Database

- MongoDB
- Mongoose
- connect-mongo

### Tools / Libraries

- Passport Local
- passport-local-mongoose
- Joi
- Multer
- Cloudinary
- multer-storage-cloudinary
- method-override
- connect-flash
- dotenv
- ejs-mate
- Vercel

## Screenshots

If you want the README to render project screenshots on GitHub, add images at the paths below:

![Homepage Screenshot](docs/screenshots/homepage.png)
![Listing Details Screenshot](docs/screenshots/listing-details.png)
![Owner Dashboard Screenshot](docs/screenshots/owner-workflow.png)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/jayesh-patil03/StayEasy.git
cd StayEasy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add:

```env
NODE_ENV=development
SESSION_SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
ATLASDB_URL=your_mongodb_atlas_connection_string
```

Notes:

- In local development, the app falls back to `mongodb://127.0.0.1:27017/wonderlust` if `ATLASDB_URL` is not used.
- Cloudinary credentials are required for listing image uploads.
- Node.js `18+` is recommended based on the project configuration.

### 4. Run the project

```bash
npm run dev
```

Or run without `nodemon`:

```bash
npm start
```

The app will be available at:

```bash
http://localhost:8080
```

## Usage

### For Tenants

- Create a tenant account or log in
- Browse room listings from the homepage
- Apply filters to narrow results by location, rent, room type, furnishing, and availability
- Open a listing to view pricing, amenities, owner details, and reviews
- Save rooms to your wishlist
- Send inquiries to owners
- Leave ratings and reviews for listed rooms

### For Owners

- Register as an owner during signup
- Create a new room listing with rent, deposit, room type, location, amenities, and image
- Edit listing details and availability when needed
- Remove listings that are no longer active
- View incoming tenant inquiries directly on the listing detail page

## Folder Structure

```bash
StayEasy/
+-- api/            # Vercel serverless entry point
+-- controllers/    # Route handlers and business logic
+-- init/           # Seed data and initialization scripts
+-- models/         # Mongoose models
+-- public/         # Static assets: CSS and client-side JS
+-- routes/         # Express routes
+-- util/           # Utility helpers and error wrappers
+-- views/          # EJS templates and reusable partials
+-- app.js          # Main Express application
+-- cloudConfig.js  # Cloudinary and Multer storage setup
+-- middleware.js   # Authentication, authorization, and validation middleware
+-- schema.js       # Joi validation schemas
+-- vercel.json     # Deployment configuration
```

## Future Improvements

- Add booking or room visit scheduling
- Add owner dashboard analytics for inquiries and listing performance
- Support multiple room images per listing
- Add map-based search with geolocation
- Add email notifications for new inquiries and status updates
- Add pagination and sorting for large listing datasets
- Introduce admin moderation for listings and reviews
- Add automated tests for routes, controllers, and validation flows

## Author

- Name: Jayesh Patil
- GitHub: [jayesh-patil03](https://github.com/jayesh-patil03)
- LinkedIn: Not included in the current repository metadata
