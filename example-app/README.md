# Rokt Kit Snippet Example

This is a simple example application that demonstrates the integration between mParticle and Rokt using the snippet approach.

## Overview

This example shows how to:

1. Initialize the mParticle Web SDK using the standard snippet approach
2. Load and register the Rokt Kit with mParticle
3. Display the Rokt Layout when a button is clicked

## Setup

1. Build the Rokt Kit by running the following command in the root directory:
   ```
   npm run build
   ```

2. Navigate to the example app directory:
   ```
   cd example-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Open `index.html` and replace the API key placeholders with your mParticle API key:
   - Look for `'REPLACE_WITH_API_KEY'` in two places and update with your API key

5. Start the example server:
   ```
   npm start
   ```

6. Open your browser and navigate to http://localhost:3000

## Usage

The example app provides a simple UI with a button that, when clicked, triggers the display of the Rokt Layout component.

1. Click the "Show Rokt Layout" button
2. If everything is set up correctly, the Rokt Layout should be displayed
3. Check the console output in the app for logs and any potential errors

## Troubleshooting

If the Rokt Layout isn't displaying:

1. Make sure you've correctly set your mParticle API key
2. Check the console output for any error messages
3. Verify that the Rokt Kit has been properly initialized by checking the logs
4. Ensure that your Rokt account is properly configured with placements
