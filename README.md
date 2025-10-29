# 📚 Smart Study Tracker

A full-stack MERN application to help students track their daily study sessions, manage tasks, and visualize academic progress.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

## ✨ Features

- 🔐 **User Authentication** - JWT-based registration and login
- 📋 **Task Management** - Create, edit, delete, and mark tasks as complete
- 📊 **Progress Analytics** - Visual charts and statistics dashboard
- ⏰ **Pomodoro Timer** - Built-in focus timer with work/break sessions
- 🌓 **Dark/Light Mode** - Toggle between themes
- 🔍 **Search & Filter** - Find tasks by name, status, or priority
- 📱 **Responsive Design** - Works seamlessly on all devices

## 📸 Screenshots

### Login Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2b858602-92dc-420d-b137-8e3d3e6e5cfb" />



### Register Page
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/47e87898-58a4-4c11-af6d-1a52bf417e4b" />



### Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3bd74802-ea74-4af6-95f1-ff1b6a2437bb" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/bebd8a2b-441e-4ead-b6f7-d37861bb0d45" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/13d7d94e-27bf-40bc-9fb3-14bbf576e76d" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e80264ee-f25d-4fd2-a236-f5b91489f65b" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2c7f7876-1e45-4fc0-bead-c0f38fdcfbfa" />






## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS, Recharts, React Router, Axios  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### 1. Clone Repository
```bash
git clone https://github.com/FaizanSyntaX/smart-study-tracker.git
cd smart-study-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with:
# MONGO_URI=mongodb://localhost:27017/smart-study-tracker
# JWT_SECRET=your_secret_key
# PORT=5000

npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

**Backend:** http://localhost:5000  
**Frontend:** http://localhost:5173

## 📁 Project Structure

```
SST/
├── backend/
│   ├── models/          # User & Task schemas
│   ├── routes/          # Auth & Task routes
│   ├── server.js        # Express server
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/       # Login & Dashboard
    │   └── App.jsx
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 💡 Usage

1. **Register/Login** - Create account or sign in
2. **Add Tasks** - Click "Add New Task" and fill details
3. **Track Progress** - View analytics on dashboard
4. **Use Pomodoro** - Click timer icon on any task
5. **Toggle Theme** - Switch between dark/light mode

## 🎨 Color Palette

- Mint Green: `#BEE9E8`
- Moonstone: `#62B6CB`
- Indigo Dye: `#1B4965`
- Columbia Blue: `#CAE9FF`
- Picton Blue: `#5FA8D3`

## 🐛 Troubleshooting

**MongoDB Connection Error:** Ensure MongoDB is running or check Atlas connection string  
**Port Already in Use:** Run `npx kill-port 5000` or `npx kill-port 5173`  
**CORS Error:** Verify both backend and frontend are running

## 👨‍💻 Author

**Mohd Faizan**  
GitHub: [@FaizanSyntaX](https://github.com/FaizanSyntaX)

## 📄 License

MIT License - Feel free to use this project for learning!

---

⭐ **Star this repo if you find it helpful!**
