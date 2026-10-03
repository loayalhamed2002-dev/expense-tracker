# Expense Tracker

Expense Tracker is a full-stack web application for managing personal expenses.

The application allows users to add, view, edit, delete, search, sort, and filter expenses. It also displays the total amount, number of expenses, and highest expense.

The application includes additional features such as Dark Mode, a chart for expenses by category, CSV export, title search, month filtering, and table sorting.

The data is stored in a PostgreSQL database through a Node.js and Express.js backend, while the frontend communicates with the backend using a REST API.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Chart.js
- Node.js
- Express.js
- PostgreSQL
- Fetch API
- Async/Await
- REST API
- CORS
- dotenv

## Project Structure

    expense-tracker/
    ├── frontend/
    │   ├── index.html
    │   ├── css/
    │   │   └── style.css
    │   └── js/
    │       └── app.js
    ├── backend/
    │   ├── server.js
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── schema.sql
    │   └── .env.example
    └── README.md

## How to Run

### Prerequisites

Make sure you have the following installed:

- Node.js
- PostgreSQL
- pgAdmin
- Visual Studio Code
- Live Server extension for VS Code

### 1. Create the Database

Open PostgreSQL or pgAdmin.

Create a new database named:

    expense_tracker

### 2. Run schema.sql

Open:

    backend/schema.sql

Run the SQL script inside the `expense_tracker` database.

This creates the `expenses` table and inserts the sample data.

### 3. Create the .env File

Inside the backend folder, you will find:

    .env.example

Create a new file in the same folder named:

    .env

Copy the environment variable structure from `.env.example` into `.env` and enter your PostgreSQL connection information.

The `.env` file contains private database information and must not be uploaded or submitted.

### 4. Install Backend Packages

Open a terminal in VS Code and navigate to the backend folder:

    cd backend

Install the required packages:

    npm install

### 5. Start the Backend

Inside the backend folder, run:

    node server.js

The backend server runs on:

    http://localhost:3000

The main API endpoint is:

    http://localhost:3000/api/expenses

Keep the backend server running while using the frontend.

### 6. Start the Frontend

Open the project in Visual Studio Code.

Navigate to:

    frontend/index.html

Right-click `index.html` and choose:

    Open with Live Server

The frontend will communicate directly with the backend API.

## Features

### Core Features

- [x] Add an expense
- [x] View all expenses
- [x] Validate required fields
- [x] Validate that the amount is greater than zero
- [x] Edit an expense
- [x] Delete an expense
- [x] Store expenses in PostgreSQL
- [x] REST API for CRUD operations

### Filtering and Searching

- [x] Filter expenses by category
- [x] Return to all expenses using the "All" filter
- [x] Search expenses by title
- [x] Filter expenses by month

### Sorting and Export

- [x] Sort table by title
- [x] Sort table by amount
- [x] Sort table by category
- [x] Sort table by date
- [x] Export expenses to CSV

### Dashboard and UI

- [x] Display total amount
- [x] Display number of expenses
- [x] Display highest expense
- [x] Display highest expense title
- [x] Expenses by Category chart using Chart.js
- [x] Dark Mode
- [x] Bootstrap modal for editing expenses
- [x] Bootstrap spinner while loading data
- [x] Bootstrap alerts for errors
- [x] Server-off error message
- [x] Responsive design
- [x] CSS Grid for summary cards

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Get all expenses |
| GET | `/api/expenses/:id` | Get one expense |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

## Expense Categories

The application supports the following categories:

- Food
- Transport
- Bills
- Entertainment
- Other

## Frontend Behavior

The frontend communicates directly with the backend API using the Fetch API.

All API operations use Fetch with Async/Await and Try/Catch for error handling.

After adding, editing, or deleting an expense, the frontend requests the expense list again from the server so that the displayed data always matches the data stored on the server.

A Bootstrap spinner is displayed while the data is loading.

Errors are displayed using Bootstrap alerts.

The summary cards calculate the total amount, number of expenses, and highest expense from all expenses, even when a filter is selected.

The category filter allows the user to filter expenses by category.

The title search allows the user to search for expenses by title.

The month filter allows the user to display expenses from a selected month.

The table headers can be used to sort expenses by title, amount, category, or date.

The Export CSV button allows the user to export the expense data as a CSV file.

## Chart

The application uses Chart.js to display expenses by category.

The chart calculates the total amount spent in each category:

- Food
- Transport
- Bills
- Entertainment
- Other

The chart is updated whenever the expense data is loaded or changed.

## Dark Mode

The application includes a Dark Mode button in the navigation bar.

The button allows the user to switch between Light Mode and Dark Mode.

Dark Mode changes the appearance of:

- Cards
- Forms
- Tables
- Modal
- Page background

## Responsive Design

The application was tested using the browser's mobile device simulation.

The layout adapts to smaller screen sizes.

The summary cards use CSS Grid with three columns on larger screens and one column on smaller screens.

The application was tested on both desktop and mobile screen sizes.

The expenses table is placed inside a responsive container to improve usability on smaller screens.

## Error Handling

The application provides clear error messages for different situations, including:

- Empty required fields
- Amount less than or equal to zero
- Invalid API responses
- Backend server being unavailable
- Invalid requests

When the backend server is stopped, the frontend displays a clear message asking the user to make sure the backend is running.

The frontend uses Try/Catch around API requests to prevent the application from failing silently.

## Screenshots

### Desktop

Add a screenshot showing the main application on desktop, including the summary cards and Add Expense form.

### Expenses Table

Add a screenshot showing the expenses table with filters, search, sorting, and action buttons.

### Mobile

Add a screenshot showing the responsive layout on a mobile screen.

### Add / Edit Expense

Add a screenshot showing the Add Expense form or Edit Expense modal.

### Chart and Dark Mode

Add a screenshot showing the Expenses by Category chart and Dark Mode.

## What Was the Hardest Part?

The hardest part was connecting the frontend to the backend API and making sure that the frontend always displayed the data stored on the server.

Another challenge was handling errors and loading states correctly.

I solved these problems by using the Fetch API with Async/Await, Try/Catch, Bootstrap alerts, and a loading spinner.

I also implemented filtering, searching, sorting, CSV export, Dark Mode, and Chart.js to improve the functionality of the application.

I tested the application with the backend turned off to make sure that the user receives a clear error message instead of seeing a broken or empty page.

## Testing

The application was tested for the main required operations:

- Adding expenses
- Viewing expenses
- Editing expenses
- Deleting expenses
- Filtering expenses by category
- Returning to the "All" category
- Searching by title
- Filtering by month
- Sorting by title
- Sorting by amount
- Sorting by category
- Sorting by date
- Exporting data to CSV
- Form validation
- Amount validation
- Loading spinner
- Bootstrap error alerts
- Backend server-off behavior
- Chart.js display
- Dark Mode
- Responsive mobile layout

## Final Delivery

The final project is submitted as a ZIP file containing the complete project.

The following items must NOT be included:

- `node_modules/`
- `.env`

The `.env.example` file should remain in the project so that another person can create their own `.env` file.

The project should be able to run by following the instructions in this README.

## Author

Expense Tracker Project

Built as part of the Dalil Academy Full Stack Web Development training program.

## UI Demonstration Video

A screen recording is provided to demonstrate the main user interface and functionality of the Expense Tracker application.

The video demonstrates:

- Adding a new expense
- Viewing expenses in the table
- Editing an existing expense
- Deleting an expense
- Searching expenses by title
- Filtering expenses by category and month
- Sorting expenses
- Viewing the expenses chart
- Using Dark Mode
### Video Link

[Watch the Expense Tracker UI Demo]
(https://1drv.ms/v/c/7d8a154a2aa946b3/IQCFHcbD8N1-Tbhuv__ZBdKJAe1cVRlSk-4sAuIVUXoQRq4?e=fKUKLC)
