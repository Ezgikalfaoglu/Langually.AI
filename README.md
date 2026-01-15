# Langually.AI
Ezginur Kalfaoğlu – Project Manager / Analyst

Branch: feature/pm-analysis

Responsibilities

Define and control the project scope for full delivery (Login, Chat, Quiz, Dashboard, Writing Submission, Adaptive Logic).

Prepare the Use Case → UI / API mapping table to ensure all requirements are covered.

Design the AI Tutor System Prompt (polite corrections, examples, adaptive feedback).

Maintain repository standards:

Folder structure

Naming conventions

.gitignore and .env.example

Manage Pull Requests and resolve merge conflicts.

Finalize submission documents:

README.md

Demo flow description

Academic limitations and assumptions note

Deliverables

Final README sections

Use Case mapping table

AI system prompt documentation

Melike Şahin – UI/UX Designer

Branch: feature/ui-ux

Responsibilities

Create the design system (style.css):

Color palette

Typography

Buttons, inputs, cards, message bubbles

Prepare core HTML layouts:

login.html (login + register)

dashboard.html

chat.html

quiz.html

writing.html

Ensure the web application is responsive and usable on mobile browsers (not a mobile app).

Design shared UI components:

Header / navigation

Alerts and loading states

Deliverables

5 HTML pages

Shared CSS design system

Sıla Demirel – Frontend Developer

Branch: feature/frontend

Responsibilities

Authentication UI logic

Register → /api/register

Login → /api/login

Store session token in localStorage

Chat interface

Send user messages to /api/chat

Display AI responses dynamically

Handle loading and error states

Quiz functionality

Fetch quiz data from /api/quiz

Submit answers to /api/quiz/submit

Display score and feedback

Dashboard integration

Fetch data from /api/dashboard

Display learning statistics

Written submission UI

Submit text to /api/writing/submit

Display feedback and suggestions

Implement a shared api.js helper for all fetch calls.

Deliverables

Frontend JavaScript modules

Fully functional UI–API integration

Ayşe Berfin Özçelik – Backend / API Developer

Branch: feature/backend

Responsibilities

Set up the Express server (server.js) with middleware.

Implement data persistence using JSON-based storage:

users.json

chatLogs.json

quizResults.json

writingSubmissions.json

Develop authentication endpoints:

POST /api/register

POST /api/login

Implement AI chat endpoint:

POST /api/chat

Real AI call if API key is available, otherwise mock response

Implement quiz logic:

GET /api/quiz

POST /api/quiz/submit

Implement dashboard endpoint:

GET /api/dashboard

Implement writing submission endpoint:

POST /api/writing/submit

Apply rule-based adaptive logic:

Difficulty adjustment based on quiz score

Deliverables

Working REST API

JSON-based persistence

.env.example file

Elif Berra Özdemir – QA & Documentation

Branch: feature/qa-docs

Responsibilities

Prepare a demo test checklist:

Registration

Login

Chat interaction

Quiz start & submission

Dashboard display

Writing submission

Perform API testing using Postman or Thunder Client.

Track and report bugs (Critical / Major / Minor).

Write a concise User Guide explaining system usage.

Contribute to README:

Known issues

System limitations

Deliverables

Test checklist

Bug list

User guide

API test samples
