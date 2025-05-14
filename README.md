# 🌲 Park Rangers – National Park Exploration Platform

Welcome to **Park Rangers**, an interactive web platform that allows users to discover, personalize, and engage with U.S. national parks. Built as a team capstone project for COSC625, this web application focuses on enhancing visitor experience through real-time park insights, personalized user accounts, and engaging multimedia content.

**Live Demo:**  
🔗 [https://hollywoodchase.github.io/COSC625-Group4Project/](https://hollywoodchase.github.io/COSC625-Group4Project/)

---

## 🚀 Project Overview

Park Rangers is designed to support both casual browsers and registered users in exploring national parks through interactive features and real-time updates. The system allows users to:

- View crowd data for parks
- Personalize their experience through visit history
- Upload and filter park-related photos and videos
- Adjust account settings like notification preferences
- View an interative map of National Parks

Our focus during this project was on building a functional MVP with real-world use cases such as family planning, outdoor exploration, and social media sharing—all in a responsive and user-friendly interface.

---

## 📸 Key Features

### ✅ Implemented in Final Iteration:
- **User Settings:** Update notification preferences
- **Visit History Tracking:** Logged and guest users can view parks they’ve visited
- **Media Gallery:** Sortable and filterable photos and videos of parks
- **Crowd Indicators:** See which parks are busy based on previous data
- **Review System:** Users can read and post reviews
- **Interactive Map:** Park markers with quick-view functionality

### 🧩 Partially Implemented or In Progress:
- **Enhanced Park Map Layers:** Trails and POIs not yet integrated
- **Review Reactions & Moderation:** Likes, flags, and star ratings pending
- **Trip Planning Tools:** Calendar and itinerary features postponed
- **Admin Dashboard & Monitoring:** Admin tools scoped for post-MVP
- **App Customization & Legal Pages:** Theming and policies deferred
- **Platform Background & Media Info:** Content pages to be added later

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, React Router
- **Backend (Prototype Stage):** Node.js, Express, MySQL
- **Authentication:** Custom user system with session support
- **APIs Used:** (Planned) National Park Service API
- **Hosting:** GitHub Pages for frontend; Render (development backend)

---

## 📁 Folder Structure

```
COSC625-Group4Project/
│
├── public/                   # Static assets
├── src/
│   ├── components/           # React components
│   ├── pages/                # Route-based pages
│   ├── services/             # API service logic
│   └── styles/               # Tailwind & global styles
├── nodejsserver/             # Backend Node.js server
│   ├── db.js                 # Database connection logic
│   ├── index.js              # Entry point for backend server
│   ├── package.json          # Backend dependencies and scripts
│   └── package-lock.json     # Locked versions of dependencies
├── .github/workflows/        # GitHub Actions CI (build/test)
├── .env                      # Environment variables (local only)
└── README.md

```

---

## 👨‍👩‍👧‍👦 User Roles

| Role        | Capabilities |
|-------------|--------------|
| Visitor     | Browse parks, view media, check crowd data |
| Registered User | Save favorites, track visits, post reviews, adjust settings |
| Admin (Planned) | Moderate content, view system analytics, manage users |

---

## 📦 Installation & Setup (Dev Environment)

```bash
# 1. Clone the repo
git clone https://github.com/hollywoodchase/COSC625-Group4Project.git
cd COSC625-Group4Project

# 2. Navigate to the frontend folder
cd npe-ui

# 3. Install frontend dependencies
npm install

# 4. Start development server
npm start

```

> ✅ The backend is deployed on Render and runs automatically in production. There is no need to manually run the `nodejsserver/` directory locally unless you are testing or developing backend features. All core functionality—such as login, visit history, and review submission—is handled via the live API.


---

## 🧪 Testing

Basic testing is integrated into the CI workflow:

- Unit tests using `Jest` or `React Testing Library`
- GitHub Actions automatically runs `npm test` and `npm run build` on each push to `main`

---

## 📋 Future Enhancements

We identified the following features as high-value but beyond the project’s MVP scope:

- 🗺️ Full trip planning tools (calendar planner, route maps, bookings)
- 🔒 Social login (Google, Facebook)
- 🎥 Live webcam feeds and AI-generated images
- 📱 Push notifications and offline access
- 📊 Admin analytics dashboard

---

## 🙌 Team Contributors

- Danny Calise 
- Uuganbayar Dashdondog 
- Mason Warner  
- Cameron Robertson  
- Dhrumil Thakkar  

> This project was completed for the Spring 2025 term of COSC625: Software Engineering.

---

## 📄 License

This project is for academic purposes only and not licensed for commercial distribution.

---

## 📬 Contact

If you have questions, feedback, or suggestions, feel free to reach out via GitHub Issues or fork the repository.
