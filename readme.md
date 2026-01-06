****📝 Real-Time Task Management System****

A robust, full-stack Task Management application featuring real-time synchronization, fluid animations, and a modern dark interface. Built with the **PERN stack** (PostgreSQL, Express, React, Node.js) and Socket.io.
    
**✅ Core Functionality**
    
    Full CRUD: Create, Read, Update, and Delete tasks seamlessly.

    Inline Editing: Edit titles and descriptions directly on the card without page refreshes.

    Status Management: Transition tasks between Pending, In-Progress, and Completed.

    Status Bar Filtering: A dynamic status filter bar allows users to instantly view tasks by category.

    Safety Net: Delete tasks with smooth CSS animations and a "Undo" snackbar option.

    Task Creation Date Tracking: Each task records its creation timestamp automatically.

**⚡ Real-Time Engine**

    Instant Sync: Utilizing WebSockets (Socket.io), changes made by one user reflect instantly across all connected clients.

    Event-Driven: Optimized broadcasts for creation, updates, and deletions.

**🎨 Premium UI/UX**

    Modern Dark Mode: A sleek, professional dark interface.

    Responsive Design: Fully optimized for Desktop, Tablet, and Mobile.

    Visual Feedback: Status-based color badges and interactive hover states.

**🛠 Tech Stack**

    Component	Technology
    Frontend	React (Vite), Axios, Socket.io-client, CSS3 (Custom)
    Backend	    Node.js, Express.js, Socket.io
    Database	PostgreSQL
    Environment	Dotenv (Security-first approach)
    



***🔌 API & Socket Specifications***

**REST Endpoints**

    Method	Endpoint	    Description
    GET	    /api/tasks	    Fetch all tasks (supports ?status= filter)
    POST	/api/tasks	    Create a new task
    PATCH	/api/tasks/:id	Update title, description, or status
    DELETE	/api/tasks/:id	Remove a task

**WebSocket Events**

    task_created: Emitted when a new task is added.

    task_updated: Emitted when any task property changes.

    task_deleted: Emitted when a task is removed.

***⚙️ Setup & Installation***

**1. Database Setup**

Ensure you have PostgreSQL installed and create a database. Run the following schema:

    CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
    );

**2. Backend Configuration**

Navigate to /backend and run

         npm install.

Create a .env file and add your credentials:

        PORT=4000
        DB_USER=your_user
        DB_PASSWORD=your_password
        DB_HOST=localhost
        DB_NAME=task_db
        DB_PORT=5432

Start the server: 
            
        npm run dev

**3. Frontend Configuration**

Navigate to /frontend and run
        
        npm install
        
Start the development server: 
    
        npm run dev (Runs on port 5173).

***🧠 Key Learnings & Engineering Challenges***

    State Consistency: Implementing logic to ensure the local React state matches the PostgreSQL database and global Socket broadcasts simultaneously.

    Concurrency: Handling real-time updates without triggering infinite re-renders or race conditions.

    Schema Design: Enforcing data integrity at the database level using PostgreSQL constraints and check clauses.

***🏁 Conclusion***

This project serves as a comprehensive example of a modern, real-time web application. It highlights the integration of relational databases with persistent bi-directional communication channels.
