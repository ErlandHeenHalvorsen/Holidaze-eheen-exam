# Holidaze

Holidaze, Exam spring 2025, Erland Heen Halvorsen

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/Holidaze-eheen-exam.git
    cd Holidaze-eheen-exam
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Project

Start the development server:
```bash
npm run dev
# or
yarn start
```

The app will be available at [Netlify](https://holidaze-exam-erlhal.netlify.app/).

## Project Structure

- `src/` - Main source code
- `public/` - Static assets
- `dist/` - Production

## Project Tree

src/
|-- App.jsx
|-- Layout.jsx
|-- assets
|   `-- heroexam-min.png
|-- components
|   |-- auth
|   |   |-- Login.jsx
|   |   `-- Register.jsx
|   |-- header
|   |   |-- Footer.jsx
|   |   `-- Header.jsx
|   |-- home
|   |   `-- HomeMain.jsx
|   |-- profile
|   |   |-- BookingsByUser.jsx
|   |   |-- CreateVenueModal.jsx
|   |   |-- EditVenue.jsx
|   |   |-- ProfileHeader.jsx
|   |   |-- ProfilePage.jsx
|   |   |-- UpdateProfile.jsx
|   |   |-- VenueCalendar.jsx
|   |   `-- VenuesByUser.jsx
|   `-- venues
|       |-- BookingForm.jsx
|       |-- HomeVenues.jsx
|       |-- VenueByIdComponent.jsx
|       |-- VenueCard.jsx
|       `-- VenuesMain.jsx
|-- index.css
|-- main.jsx
|-- pages
|   |-- Auth.jsx
|   |-- Home.jsx
|   |-- Profile.jsx
|   |-- VenueById.jsx
|   `-- Venues.jsx
|-- stores
|   `-- useAuthStore.js
`-- utils
    `-- useFetch.js

## Additional Information

Because of issues with my first repo i had to start over. Some components were saved and reused, and the hooks are reused as well.
