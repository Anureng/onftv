# Event Management Application

## Overview
A full-stack application to manage events, featuring AI content generation and PDF export.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, shadcn/ui, React Hook Form, Zod
- **Backend:** Node.js, Express, TypeScript, MongoDB, Zod

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI
- Google Gemini API Key for AI generation

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`.
4. Run in development mode: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the necessary variables.
4. Run the application: `npm run dev`

## Features
- Complete CRUD operations for events.
- AI-generated event descriptions and speaker intros using Google Gemini.
- Export event details to PDF.
- Modern, responsive UI with shadcn/ui and Tailwind CSS.
