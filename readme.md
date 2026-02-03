# 🎥 My Movie - Full Stack Web Application

## Description
<p style="text-align: justify;">
A  full-stack solution for managing a database of movies and actors. 
This application allows users to create relationships between films and their casts, featuring a responsive UI and REST API.
The project includes a demonstration SQLite database movies-extended.db with sample data to allow quick startup and testing of the API.
</p>

## Key Features
### Frontend (React)
- **Modular Components:** Independent React components with dedicated stylesheets.
- **Responsive Design:** Mobile-friendly layout with grid-based navigation.
- **Actor Assignment:** Smart actor selection with pinned assigned items.
- **Live Search:** Real-time filtering with automatic reset on navigation.
- **Empty States:** Messages when no results are available.
- **Loading States:** Visual feedback during data fetching implemented with `lds-ellipsis` from https://loading.io/css/.
- **User Feedback:** Toast notifications for all user actions.

### Backend (FastAPI)
* **RESTful API:** CRUD operations for movies and actors.
* **Batch Operations:** Efficient batch deletion for multiple records in a single request.
* **Relational Database:** Managed Many-to-Many relationships between movies and actors.
* **Error Handling:** Proper HTTP status code management (400 Bad Request, 404 Not Found, 409 Conflict, 500 Server Error)

## Technologies used

| Tool / Library            | Description                                     |
|---------------------------|-------------------------------------------------|
| <u>**Frontend:**</u>      |                                                 |
| **React**                 | JavaScript library for building the UI.         |
| **JavaScript**            | Core frontend programming language.             |
| **CSS / Milligram**       | Base styling with custom CSS on top .           |
| **React-Toastify**        | Toast notifications for user feedback.          |
| <u>**Backend:**</u>       |                                                 |
| **Python 3.13+**          | Programming language for backend logic.         |
| **FastAPI**               | Web framework for building the API.             |
| **SQLite**                | Relational database for data storage.           |
| **Uvicorn (ASGI Server)** | High-performance server to run the application. |


## Project structure
```
react-python-movies/
├── api/                    # RESTful API
│   ├── main.py             # API Routing & Request Handling            
│   ├── db.py               # Database connection
│   ├── crud.py             # CRUD (Create, Read, Update, Delete) Operations
│   ├── test_main.http.py   # API Testing
│   ├── movies-extended.py  # Demo database
│   ├── requirements.txt
│   ├── .gitignore
│   └── README.md
├── ui/                     # React Single Page Application
│   ├── public/             # Static assets (images, icons, index.html)
│   ├── src/                
│   │   ├── App.js          # Root component & main state management
│   │   ├── App.css         # Global styles    
│   │   ├── index.js        # Application entry point
│   │   └── *.js/*.css      # UI components with styles (Forms, Lists, Navbar)         
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── README.md
├── .dockerignore
├── Dockerfile
├── .gitignore
└── README.md               # Main project documentation
```

## Getting started
1. Clone the repository:
```
git https://github.com/Anna-1233/react-python-movies.git
```
2. Backend Setup:

    2.1. Navigate to the `/api` directory:
    ```
    cd react-python-movies/api
    ```
    2.2. Create and activate virtual environment:
    ```
    python -m venv venv

    source venv/bin/activate  # Linux/Mac
    venv\Scripts\activate     # Windows
    ```
    2.3. Install dependencies:
    ```
    pip install -r requirements.txt
    ```
    2.4. Start the server:
    ```
    uvicorn main:app --reload
    ```
    Access the API at http://localhost:8000.

    Open http://localhost:8000/docs to see the interactive Swagger UI.


3. Frontend Setup

    3.1. Navigate to the `/ui` directory:
    ```
    cd react-python-movies/ui
    ```
    3.2. Install dependencies: 
    ```
    npm install
    ```
    3.3. Start the application: 
    ```
    npm start
    ```
    The browser will automatically open the app at http://localhost:3000.


## Author
**Anna Czopko** \
📧 aczopko@student.agh.edu.pl