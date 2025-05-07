# 🌲 Park Rangers – National Park Exploration Platform

Welcome to **Park Rangers**, an interactive web platform that allows users to discover, personalize, and engage with U.S. national parks. Built as a team capstone project for COSC625, this web application focuses on enhancing visitor experience through real-time park insights, personalized user accounts, and engaging multimedia content.

**Live Demo:**  
🔗 [https://hollywoodchase.github.io/COSC625-Group4Project/](https://hollywoodchase.github.io/COSC625-Group4Project/)

---

## 🚀 Project Overview

Park Rangers is designed to support both casual browsers and registered users in exploring national parks through interactive features and real-time updates. The system allows users to:

- View real-time crowd data for parks
- Personalize their experience through visit history
- Browse and filter park-related photos and videos
- Share favorite media with friends
- Adjust account settings like notification preferences and privacy

Our focus during this project was on building a functional MVP with real-world use cases such as family planning, outdoor exploration, and social media sharing—all in a responsive and user-friendly interface.

---

## 📸 Key Features

### ✅ Implemented in Final Iteration:
- **User Settings:** Update notification and privacy preferences
- **Visit History Tracking:** Logged and guest users can view parks they’ve visited
- **Media Gallery:** Sortable and filterable photos and videos of parks
- **Image Lightbox & Sharing:** Enlarged views with social sharing
- **Real-Time Crowd Indicators:** See which parks are busy in real-time

### 🧩 Partially Implemented or In Progress:
- **Review System:** Users can read and post reviews (likes/dislikes in future)
- **Interactive Map (basic):** Park markers with quick-view functionality

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, React Router
- **Backend (Prototype Stage):** Node.js, Express, MySQL
- **Authentication:** Custom user system with session support
- **APIs Used:** (Planned) National Park Service API, OpenWeatherMap
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

# 2. Install frontend dependencies
npm install

# 3. Start development server
npm start
```

> ⚠️ Backend services were developed in prototype form using Express. To test full functionality (e.g., login, visit history), clone and run the `nodejsserver/` directory with a local MySQL instance and `.env` file.

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
