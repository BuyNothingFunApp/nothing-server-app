
# Nothing Server App

Comprehensive backend for a lightweight e-commerce-like server providing product listing, checkout/payment handling, and share/contact features.

## Table of contents

- Project description
- Features
- Tech stack
- Prerequisites
- Installation
- Environment variables
- Running the app (development & production)
- Available scripts
- Deployment
- API reference (endpoints)
- Logging & error handling
- Testing
- Contributing
- License
- Contact

## Project description

`nothing-server-app` is a TypeScript Node/Express backend that exposes simple product listing endpoints and payment/checkout flows using providers such as Razorpay (and preparedness for Stripe). It includes utilities for email sending, logging, and basic share/contact actions.

The codebase is organized under `src/` with controllers, routes, models, middleware and utilities.

## Features

- Product listing and product detail endpoints
- Checkout flow with payment creation and validation
- Share and contact endpoints for user messages
- Winston-based logging
- Email sending utility (nodemailer)
- TypeScript with build and lint scripts

## Tech stack

- Node.js + Express
- TypeScript
- MongoDB (mongoose)
- Razorpay (payment provider)
- Nodemailer (email)
- Winston (logging)
- Zod (input validation)

## Prerequisites

- Node.js (>=16 recommended)
- npm or yarn
- A MongoDB instance (local or hosted)
- Razorpay account (if you intend to use Razorpay flows)
- SMTP credentials (for email features)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/SinhaGautam/nothing-server-app.git
cd nothing-server-app
npm install
```

If you prefer yarn:

```bash
yarn install
```

## Environment variables

Create a `.env` file at the project root (see `.env.example` if you create one) and provide the following keys used throughout the app:

- `PORT` — port the server listens on (default 3000)
- `NODE_ENV` — `development` or `production`
- `MONGO_URI` — MongoDB connection URI (may include `<PASSWORD>` placeholder)
- `DB_PASSWORD` — password for MongoDB if `MONGO_URI` uses placeholder replacement
- `RAZORPAY_KEY_ID` — Razorpay API key id
- `RAZORPAY_KEY_SECRET` — Razorpay API secret
- `BASE_URL` — Base URL for links in emails or share endpoints (default provided)
- `SMTP_HOST` — SMTP host (default: smtp.gmail.com)
- `SMTP_PORT` — SMTP port (default: 587)
- `SMTP_USER` or `EMAIL_USER` — SMTP username
- `SMTP_PASSWORD` or `EMAIL_PASSWORD` — SMTP password
- `SMTP_FROM` or `EMAIL_FROM` — Default from address for outgoing emails
- `SUPPORT_EMAIL` — Support address for inbound notifications

Note: The code references these environment variables in `src/` files (for example, `src/app.ts`, `src/server.ts`, `src/controllers/checkout.controller.ts`, and `src/utils/emailService.ts`).

## Running the app

Development (uses ts-node-dev):

```bash
npm run start
```

This runs `ts-node-dev --respawn --transpile-only src/server.ts` and will restart on file changes.

Production build (compile then run):

```bash
npm run build
node dist/server.js  # or run your compiled entrypoint
```

## Available npm scripts

Taken from `package.json`:

- `npm run dev` — development server with ts-node-dev (watch mode)
- `npm run start` — start the production server
- `npm run build` — compile TypeScript using `tsc`
- `npm run lint` — run ESLint over `.ts` files
- `npm run lint:fix` — run ESLint and auto-fix
- `npm test` — placeholder (no tests configured)

If you add tests, update `test` script accordingly.

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Configure the following environment variables in Vercel's project settings:
   - `MONGO_URI`
   - `DB_PASSWORD`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER` (or `EMAIL_USER`)
   - `SMTP_PASSWORD` (or `EMAIL_PASSWORD`)
   - `SMTP_FROM` (or `EMAIL_FROM`)
   - `SUPPORT_EMAIL`
   - `BASE_URL` (set to your Vercel deployment URL)
   
5. Deploy! Vercel will automatically:
   - Install dependencies
   - Run `npm run build` to compile TypeScript
   - Start the server using `npm start`

The project includes a `vercel.json` configuration that handles:
- Build settings
- Route configuration
- Environment setup

To deploy from your terminal using the Vercel CLI:

```bash
npm i -g vercel
vercel
```

To deploy to production:

```bash
vercel --prod
```

## API reference

Base path: `/` (server root). The following routes exist in `src/routes`:

- Products (`src/routes/productRoutes.ts`)
	- GET `/products/` — list products (controller: `ProductController.getProduct`)
	- GET `/products/:id` — get product by id (controller: `ProductController.getProductById`)

- Checkout (`src/routes/checkoutRoutes.ts`)
	- POST `/checkout/` — initiate checkout / create payment (controller: `CheckoutController.handleCheckout`)
	- POST `/checkout/validate` — validate a payment signature (controller: `CheckoutController.validatePayment`)
	- POST `/checkout/confirm` — confirm and persist an order (controller: `CheckoutController.confirmOrder`)

- Share / Contact (`src/routes/shareRoutes.ts`)
	- POST `/share/share` — share action (controller: `ShareController.handleShare`)
	- POST `/share/contact` — contact/support message (controller: `ShareController.handleContact`)

Note: Many controllers use environment variables and helpers for payment verification and email sending. Check `src/controllers/*` and `src/utils/*` to see request/response shapes.

## Logging & error handling

- Winston is used for logging (`src/utils/logger.ts`).
- There's a centralized error handler middleware at `src/middleware/errorHandler.ts` — errors are formatted into consistent API responses.

## Testing

There are no automated tests configured at the moment. To add tests, consider Jest or Vitest, add a `test` script and create a minimal test for controllers or utils.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run and add tests where applicable
4. Open a PR with a clear description

Please follow the existing TypeScript style and run linters before opening a PR:

```bash
npm run lint
npm run lint:fix  # to auto-fix issues
```

## License

This project currently lists `ISC` in `package.json`. Replace or update as needed.

## Contact

For questions, open an issue on the repository or contact the maintainer listed in `package.json`.

---