# Implementation Plan - KSM_Real Estate

Building a premium real estate application with Next.js and Spring Boot, featuring a dark minimalist design and specific imagery requirements.

## Proposed Changes

### Database
#### [NEW] [schema.sql](file:///home/ulrich/.gemini/antigravity/scratch/ksm-real-estate/backend/src/main/resources/schema.sql)
- Tables: `users`, `properties`, `visit_requests`, `payments`.
- Initial data for admin, concierges, and 6 properties.

### Backend (Spring Boot 8080)
- **Entities**: JPA models for the database tables.
- **Security**: Custom header-based authentication simulation.
- **Public API**: Search, filtering, details, visit requests, payment simulation.
- **Concierge API**: CRUD for their own properties.
- **Admin API**: Global management of properties, users, and requests.

### Frontend (Next.js 3000)
- **Design**: Dark theme (#000000), gold accents (#D4AF37), Montserrat/Inter/Poppins.
- **Imagery**: Exclusively black people (Unsplash).
- **Pages**:
    - Home: Grid of properties, filters.
    - Detail: Carousel, booking modal, payment simulation.
    - Login: Role-based redirect.
    - Concierge/Admin: Dashboards with tables and forms.
- **PDF**: Client-side generation using `jsPDF`.

## Verification Plan

### Automated Tests
- Postman/Curl tests for backend endpoints.
- Browser-based validation of frontend flows.

### Manual Verification
- Verify image criteria (black people only).
- Test PDF generation and content accuracy.
- Validate dark mode premium aesthetic.
