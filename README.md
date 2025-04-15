# mParticle JavaScript Integration for Rokt

This repository contains the mParticle JavaScript integration (kit) for Rokt.

## Getting Started

### Adding the integration to your app

To add this integration to your mParticle setup, follow these steps:

1. Add the Rokt Kit script to your website alongside the mParticle snippet:
   ```html
   <script src="path/to/Rokt-Kit.iife.js"></script>
   ```

2. Register the kit with your mParticle configuration:
   ```javascript
   window.mParticleRokt.register({
     kits: {}
   });
   ```

3. Configure your mParticle instance with the Rokt Kit settings:
   ```javascript
   window.mParticle.config.kitConfigs.push({
     name: 'Rokt',
     settings: {
       accountId: 'YOUR_ROKT_ACCOUNT_ID',
       onboardingExpProvider: 'None'
     }
   });
   ```

## Snippet Example

A simple snippet example application is included in this repository to demonstrate the integration between mParticle and Rokt. The example shows how to:

1. Initialize the mParticle Web SDK with the standard snippet
2. Load and register the Rokt Kit
3. Display the Rokt Layout when a button is clicked

### Running the Example

To run the example:

1. Build the Rokt Kit:
   ```
   npm run build
   ```

2. Navigate to the example app directory:
   ```
   cd example-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Update the API key in `index.html` with your mParticle API key

5. Start the server:
   ```
   npm start
   ```

6. Open your browser to http://localhost:3000

## Development

### Building the kit

```
npm install
npm run build
```

### Testing

```
npm test
```

## Documentation

Complete documentation for this integration can be found on the [mParticle docs site](https://docs.mparticle.com/integrations/rokt/event/).

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
