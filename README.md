# TasteBase
> *The go-to place to pick out your meals. Just pick an ingredient (or more) and let us find you recipes!*

Aaron Espinoza, Heston Montagne, Dylan Priebe, Jeremiah Stone, and Russell Sullivan are working together to create a web-app that connects users who want to improve their cooking skills to recipes that are relevant to their tastes and available ingredients. The goal of the app is to make cooking feel easier for aspiring cooks who find the process daunting by simplifying the research step.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Getting Started](#getting-started)
* [Testing & Reports](#testing-and-reports)
<!-- * [Acknowledgements](#acknowledgements) -->
<!-- * [License](#license) -->


## General Information
TasteBase is the solution to figuring out what you want to cook. We intend to make recipe selection the easiest process in the world, based on the ingredients you have at home already.
We hope to help everyone who cooks pick out their food more easily and deliberately. 


## Technologies Used
- React Native
- Expo
- Expo Go
- Java
- SQL
- The Meal DB


## Features

### Pantry Tracking
This feature allows users to add and remove ingredients from their personal pantry so they can easily track their available ingredients. 

### Recipe Suggestion
This feature allows the app to suggest recipes to the user for them to cook. It uses the user's pantry to filter recipes based on ingredients the user has on hand. 

### Recipe Saving
Users can save existing recipes from the app's suggestion list or search results for quick access later.

### Recipe Creating
This feature gives the user the ability to list the required ingredients necessary for their own recipes to be suggested later.

## Project Status
Project is: _in progress_

## Room for Improvement

### Testing:
- Unit test for add ingredient to pantry react native input
- Unit test for remove ingredient from pantry react native input
- Unit test for tab navigation

### Features:
- Loading and Storing User's favorite recipes to and from the database
- Connect pantry to backend with Spoonacular ingredient parsing.
- Search for recipes based on the user's available ingredients.
- Create user login & logout

### Recipe Recommendation:
- Recommend recipes based on different cultures. For example, when the user asks for Indian or Greek recipes.
- Recommend recipes based on food nutrients. For example, when the user asks for high-protein, high carbohydrate, zero-carbohydrate(keto), low-fat, low sugar, high sugar, etc.
- When the user has nothing in their pantry, ask them what kind of food they might want and give recommendations based off this initial user input

## Getting Started
Here are instruction on how to run the app locally from your device.

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the backend API URL (optional):
   Create a `.env` file in the frontend directory and set your backend URL:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://example-deployed-backend-url.com
   ```
   
   If no `.env` file is created, the app will use the localhost, in which case you would need to run the backend locally too. This would not connect to the app's deployed server. If you do neither of these things, crucial features (including seeing recipes) won't work. 

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - **Mobile**: Install Expo Go app on your phone and scan the QR code
   - **Android Emulator**: `npm run android` *or* run development server and input 'a' 
   - **iOS Simulator**: `npm run ios` (macOS only)
   - **Web**: `npm run web` *or* run development server and input 'w'

### Backend Information
The backend is already deployed and running on a server. The frontend automatically connects to the deployed backend API. No local backend setup is required for normal usage.

### API Documentation
The deployed backend API documentation is available at the deployed server's Swagger UI endpoint. Go to base server url to see this documentation. 

## Testing and Reports

### Frontend Unit Testing
The frontend uses jest for testing components and methods. Testing files are located in the frontend/tests/ directory. Reports for tests are located in the frontend/tests/results/ directory.

The following are recommended commands for running the available unit tests.
```
npm test
```
Will run all available test suites. The only feedback is the Jest CLI output. No reports will be generated.

One or more space-separated test file names can be appended to the end of the command. Only those test suites will run.
```
npm run test:combined-report
```
Will run all available test suites. Then, an HTML report containing pass/fail status and execution times for all the tests will be generated. This report is named test-report.html and will be placed in the frontend/tests/results/ directory. 
```
npm run test:reports
```
Will just trigger the generate-test-report.js script, which will run each test suite found in the frontend/tests/ directory or its subdirectories (.test.ts and .spec.ts files only). Each file will be run separately and an HTML test report, with pass/fail status and execution times, will be generated for each file. The html report will be named after the test file name (e.g. testSuite12.test.ts => testSuite12-report.html) and will be placed in the frontend/tests/results/ directory using a directory structure that mirrors where the file was found in the frontend/tests/ directory.

One or more space-separated test file names can be appended to the end of the command. Only those test suites will run and reports will only be generated for those files.
```
npm run test:coverage
```
Running this command will cause all available test suites to run. Then, a comprehensive coverage report of the entire frontend codebase will be generated in the frontend/tests/results/coverage/ directory. 



<!-- ## Acknowledgements
Give credit here.
- This project was inspired by...
- This project was based on [this tutorial](https://www.example.com).
- Many thanks to... -->



<!-- Optional -->
<!-- ## License -->
<!-- This project is open source and available under the [... License](). -->

<!-- You don't have to include all sections - just the one's relevant to your project -->
