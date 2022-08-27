# Coding exercise at home - Online Filings

## Getting Started

### Prerequisites

Following are the prerequisites for this exercise:

- node
- mongodb

### Installation

Below is an example of how you can install and set up your app.

1. Install dependencies

```sh
npm install
```

2. Create a new file `.env` if it doesn't exist and copy the contents of `env.dev` into it to be able to run your server on production environment.

3. Then update the values of the configuration env files at the `.env` file.

### Running the server

1. Start up the server - Run

```sh
# development
npm run dev

# production
npm start
```

2. Server should be running on http://localhost:5000 by default

## Exercise

BASE URL: api/v1

Tasks: /tasks

1. / GET - Get all tasks (Filters => name, status & sorts => dueAt, startAt, doneAt)
2. /:id GET - Get a task by ID
3. / POST - Create a new task
4. /:id PUT - Update an existing task
5. / - Delete an existing task
6. /status/:id PUT - Update the status of a task

Projects: /projects

1. / GET - Get all projects (Filters => name & sorts => dueAt, startAt)
2. /:id GET - Get a project by ID
3. / POST - Create a new project
4. /:id PUT - Update an existing project
5. / - Delete an existing project
6. /task POST - Assing / Unassign a task to a project

Aggregations: /aggregations

1. /tasks GET - All the tasks that have a project with a due date set to “today”
2. /projects GET - All the projects that have a task with a due date set to “today”
