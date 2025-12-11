# Niger Savoir+ - Exam Sharing Platform

A modern, full-stack web application for sharing educational documents (exams, courses, homework) among students in Niger, featuring social networking capabilities and intelligent recommendations.

## 🌟 Features

### Frontend

- **Modern UI/UX**: Premium design with glassmorphism effects, smooth animations, and African-inspired color scheme
- **Background Images**: Custom-generated educational-themed backgrounds
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Advanced Search**: Filter documents by subject, level, type, school, region, and year
- **Dark Mode Support**: Built-in theme switching

### Backend

- **RESTful API**: Spring Boot 3.x with MySQL database
- **JWT Authentication**: Secure token-based authentication
- **Social Networking**: School, city, and region-based networks
- **Recommendation Engine**: Personalized document recommendations based on user behavior
- **File Management**: Document upload and download with tracking
- **Role-Based Access**: USER and ADMIN roles

## 🏗️ Architecture

### Frontend Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)

### Backend Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8.x
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

## 📁 Project Structure

```
NigerSavoir/
├── FrontNiger/                 # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions
│   │   └── index.css           # Global styles with custom animations
│   ├── public/                 # Static assets
│   │   ├── hero-bg.png         # Hero section background
│   │   ├── pattern-bg.png      # Pattern overlay
│   │   └── network-bg.png      # Network section background
│   └── package.json
│
└── BackNiger/                  # Backend Spring Boot application
    ├── src/main/java/com/nigersavoir/
    │   ├── entity/             # JPA entities
    │   │   ├── User.java
    │   │   ├── School.java
    │   │   ├── Document.java
    │   │   ├── Network.java
    │   │   └── UserBehavior.java
    │   ├── repository/         # Spring Data repositories
    │   ├── service/            # Business logic
    │   ├── controller/         # REST controllers
    │   ├── config/             # Security & JWT configuration
    │   ├── dto/                # Data Transfer Objects
    │   └── util/               # Utility classes (JWT)
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.6+
- **MySQL** 8.0+

### Database Setup

1. Install and start MySQL server
2. Create the database (or let Spring Boot create it automatically):

```sql
CREATE DATABASE nigersavoir_db;
```

3. Update database credentials in `BackNiger/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd BackNiger
```

2. Build the project:

```bash
mvn clean install
```

3. Run the application:

```bash
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080/api`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd FrontNiger
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Documents

- `GET /api/documents` - List all documents
- `GET /api/documents/{id}` - Get document by ID
- `POST /api/documents` - Upload new document (authenticated)
- `GET /api/documents/search` - Search documents with filters
- `GET /api/documents/download/{id}` - Download document

### Networks

- `GET /api/networks` - List all networks
- `GET /api/networks/my` - Get user's networks (authenticated)
- `GET /api/networks/{id}/documents` - Get documents in network

### Recommendations

- `GET /api/recommendations` - Get personalized recommendations (authenticated)

## 🎨 Frontend Features

### Custom CSS Classes

- `.glass` - Glassmorphism effect
- `.glass-card` - Enhanced glass card
- `.premium-card` - Premium card with hover effects
- `.gradient-text` - Gradient text effect
- `.network-badge` - Network indicator badge
- `.bg-pattern` - Background pattern overlay
- `.bg-hero` - Hero background image

### Animations

- Fade in/out
- Slide animations
- Bounce effects
- Shimmer effects
- Floating elements
- Gradient shifts

## 🔐 Security

- **Password Encryption**: BCrypt hashing
- **JWT Tokens**: Secure authentication with 24-hour expiration
- **CORS**: Configured for frontend origins
- **Role-Based Access**: Admin and user roles
- **SQL Injection Protection**: Parameterized queries via JPA

## 🌐 Social Networking

Users are automatically added to networks based on:

1. **School Network**: Students from the same school
2. **City Network**: Students from the same city
3. **Region Network**: Students from the same region

This enables:

- Prioritized content from your networks
- Network-specific document feeds
- Community building

## 🤖 Recommendation System

The platform provides intelligent recommendations based on:

1. **User Behavior**: Documents you've viewed/downloaded
2. **Collaborative Filtering**: What similar users interact with
3. **Network Popularity**: Popular documents in your school/city
4. **Content Similarity**: Documents similar to your interests

## 📝 Database Schema

### Main Tables

- `users` - User accounts with school and location
- `schools` - Educational institutions
- `documents` - Uploaded exam papers and study materials
- `networks` - School/city/region networks
- `user_networks` - User-network relationships
- `user_behaviors` - Tracking for recommendations

## 🎯 Future Enhancements

- [ ] Comments and ratings on documents
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile applications (iOS/Android)
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Document preview
- [ ] Bookmarks/favorites
- [ ] User profiles with activity feed

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Laminou Amadou Ahmed**

## 🙏 Acknowledgments

- shadcn/ui for the beautiful UI components
- Spring Boot team for the excellent framework
- The educational community of Niger

---

**Note**: Make sure to configure your MySQL database and update the `application.properties` file with your database credentials before running the backend.
