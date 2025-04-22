# mParticle Rokt Kit Example App

This is an example web application that demonstrates the integration of the mParticle Rokt Kit using webpack.

## Setup

1. Clone the repository
2. Build the parent project first to create the Rokt Kit:
```
cd ..
npm run build
```
3. Install dependencies in the example app:
```
cd example-app
npm install
```
4. Set up your environment variables:
```
cp .env.example .env
```
5. Update the `.env` file with your actual Rokt API key and Account ID:
```
ROKT_API_KEY=your-api-key-here
ROKT_ACCOUNT_ID=your-account-id-here
```

## Development

To start the development server with hot-reloading:
```
npm start
```

This will open the application in your default browser at http://localhost:3000.

## Building for Production

To build the application for production (this will automatically build the parent project first):
```
npm run build
```

This will create a `dist` directory with the bundled application.

## Project Structure

- `src/` - Source code directory
  - `index.html` - HTML template
  - `index.js` - Main JavaScript file
  - `styles.css` - CSS styles
- `dist/` - Production build output (created after running build)
- `.env` - Environment variables (not tracked in git)
- `.env.example` - Example environment variables template
- `.gitignore` - Git ignore configuration
- `webpack.config.js` - Webpack configuration
- `package.json` - Project dependencies and scripts
- `../dist/Rokt-Kit.iife.js` - Rokt Kit integration from parent project

## Environment Variables

The application uses the following environment variables:

- `ROKT_API_KEY`: Your mParticle API key for Rokt integration
- `ROKT_ACCOUNT_ID`: Your Rokt Account ID used for configuring the Rokt kit

These variables should be stored in a `.env` file that is not committed to version control.

## Features

- Webpack bundling for modern JavaScript development
- CSS loading with style-loader and css-loader
- Development server with hot reloading
- Production build optimization
- Integration with the parent project's Rokt Kit
- Environment variable configuration for secure API key management

## Using the Example App

1. Click the "Fire Event" button to trigger a test event in mParticle
2. Click the "Show Rokt Offer" button to display a Rokt placement
3. Check the console output area at the bottom of the page for debug information
