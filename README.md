# Bookshelf.js 📚



Overview

Bookshelf.js is a revolutionary digital reading management system designed to simplify book discovery, organization, and tracking.
 Built using React.js (Frontend), Node.js (Backend), and MongoDB (Database), it enables users to seamlessly manage their digital libraries across platforms.

 Simply sign up, open the website, drag and drop the pdf of a book you wish to read, and start reading with music and dynamic backgrounds to keep you company while you dive deep into your book.

Features 🚀

📖 Digital Library Management: Store, organize, and track your books.

✅ Task & Planner Integration: Add and manage reading tasks efficiently.

📝 Notes & Highlights: Save and retrieve notes across multiple sessions.

🌍 Cross-Platform Support: Use on both desktop and mobile devices.

💻 Open Source: Community-driven development ensuring continuous improvement.

Tech Stack 🛠️

Frontend: React.js

Backend: Node.js, Express.js

Database: MongoDB

Installation & Setup ⚙️

1. Clone the Repository

git clone https://github.com/yourusername/Bookshelf.js.git
cd Bookshelf.js

2. Install Dependencies

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

3. Setup Environment Variables

Create a .env file in the server directory with the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

4. Run the Application

# Start the backend server
cd server
npm start

# Start the frontend
cd ../client
npm start

The app will be running on http://localhost:3000/ 🎉

Screenshots 🖼️

Home Page



Task Manager



Notes Section



API Endpoints 📡

Method

Endpoint

Description

POST

/api/auth/register

Register a new user

POST

/api/auth/login

Login and get a token

GET

/api/books

Fetch all books

POST

/api/books

Add a new book

DELETE

/api/books/:id

Delete a book

Contribution 🤝

We welcome contributions! Feel free to fork the repository and submit pull requests. Join the discussion on GitHub Issues.

License 📜

MIT License. See LICENSE file for details.

📬 Contact: YourEmail@example.com | 🌍 Website: yourwebsite.com

