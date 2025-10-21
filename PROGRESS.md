# Home-Coaching App Progress Tracker

## Project Overview
- **Tech Stack**: React Native (Expo), Supabase (DB, Auth, Storage, Realtime), TanStack Query (server-state), Zustand (client-state), Node.js/FastAPI backend for ML/OCR/PDF.
- **Goals**: Secure (JWT, RLS, encryption), Scalable (pagination, caching, auto-scaling), End-to-End (from onboarding to high-load matching/analytics).
- **Phases**: Build incrementally; test each phase on iOS/Android simulators.

## Phase 1: Setup & Onboarding (Status: [Pending])
- **Features**:
  - Project init with Expo.
  - Supabase integration (client setup, auth with email/phone/Google).
  - Onboarding flows: Separate for students (profile, location) and teachers (profile, location restriction, verification).
  - Security: Email verification, role-based access (student/teacher).
  - Scalability: Basic caching with TanStack Query for user data.
- **Updates**:
  - [Date]: Initialized project and Supabase client.
  - [Date]: Onboarding screens built; tested sign-up.
- **Tests**: Unit tests for auth; manual testing for location input.
- **Next**: Integrate Zustand for local state (e.g., form data).

## Phase 2: Location-Based Matching (Status: [Pending])
- **Features**:
  - Geolocation integration (Expo Location) to restrict teachers to areas.
  - Matching algorithm: Query Supabase for nearby teachers based on student location (use geospatial queries).
  - UI: Student search screen showing local teachers; teacher dashboard for available students.
- **Security**: Encrypt location data; RLS policies to limit data access by role/location.
- **Scalability**: Pagination for teacher lists; TanStack Query caching for searches.
- **Updates**:
  - [Date]: Added geospatial indexing in Supabase.
- **Tests**: Simulate locations; load test with 100+ mock users.

## Phase 3: Question Bank Management & Test Creation (Status: [Pending])
- **Features**:
  - Question bank UI: Fetch/filter questions (JEE/NEET/Board) from Supabase.
  - Test creation: Select questions, custom uploads (image → AI OCR via backend), PDF export (backend-generated).
  - Integration: TanStack Query for fetching questions; Zustand for selected questions state.
- **Security**: Validate uploads; RLS for teacher-owned questions.
- **Scalability**: Infinite scroll for large banks; edge functions for OCR processing.
- **Updates**:
  - [Date]: Question table schema created in Supabase.
- **Tests**: OCR accuracy; PDF generation speed.

## Phase 4: Online Testing & OMR Scanning (Status: [Pending])
- **Features**:
  - Online test UI: Timer, submission, instant scoring.
  - OMR: Camera capture, backend ML processing.
  - Realtime: Supabase subscriptions for live updates.
- **Security**: Secure test links; prevent cheating (e.g., proctoring hooks).
- **Scalability**: Handle concurrent tests with Supabase realtime; queue ML jobs.
- **Updates**:
  - [Date]: Integrated react-native-vision-camera.
- **Tests**: Simulate 50 concurrent users.

## Phase 5: Analytics Dashboard & Attendance (Status: [Pending])
- **Features**:
  - Dashboard: Charts for averages, progress (react-native-chart-kit).
  - Attendance: Check-ins tied to sessions.
  - TanStack Query for analytics queries; Zustand for filters.
- **Security**: Anonymize data; RLS for personal analytics.
- **Scalability**: Materialized views in Supabase for fast queries.
- **Updates**:
  - [Date]: Added results table.
- **Tests**: Query performance under load.

## Phase 6: Students Feed & Final Polish (Status: [Pending])
- **Features**:
  - Feed: Teachers post content; students see nearby posts (location-filtered).
  - Notifications, chat for matches.
- **Security**: Moderate posts; end-to-end encryption for chats.
- **Scalability**: Realtime subscriptions; CDN for media.
- **Updates**:
  - [Date]: Feed screen built.
- **Tests**: End-to-end app flow; high-load simulation (e.g., Locust tool).

## Overall Status
- Completed Phases: 0/6
- Issues: [List any blockers]
- Deployment: [Notes on Expo publish or app stores]
