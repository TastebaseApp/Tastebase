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

***Corresponding Stories***

- As a general user, I want to view a list of my ingredients so that I can easily track my available ingredients for cooking. 

- As a general user, I want to add ingredients to my pantry so that I can keep my pantry up to date when I buy new food ingredients. 

- As a general user, I want to delete ingredients from my pantry so that I can keep my pantry up to date as I use or get rid of food ingredients.


### Recipe Suggestion
This feature allows the app to suggest recipes to the user for them to cook. It uses the user's pantry to filter recipes based on ingredients the user has on hand. 

***Corresponding Stories***

- As a general user, I want the app to recommend recipes for me to cook so I can try out new recipes when cooking.

- As a general user, I want the recipes recommended to me to be filtered to fit the ingredients I have in my pantry. 

### Recipe Saving
Users can save existing recipes from the app's suggestion list or search results for quick access later.

***Corresponding Stories***

- As a general user, I want to save a recipe from the suggestions so that I can easily find it again.

- As a general user, I want to view my saved recipe list so that I can quickly pick from my personal favorites.

- As a general user, I want to remove a saved recipe so that I can keep my list relevant.

### Recipe Creating
This feature gives the user the ability to list the required ingredients necessary for their own recipes to be suggested later.

***Corresponding Stories***

- As a general user, I want to create a custom recipe and list its required ingredients so that the app can recommend it when my pantry matches.

- As a general user, I want to add personal notes or tweaks to a saved recipe so that I can remember improvements.

## Sprint 1 (September 22 - October 3)
**Demo Branch:** dev
### Contributions

**Heston:** "Provided UI for the pantry list and recipe tab to display recipes to the user"

- Create pantry view tab
    - [EWOK-3](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-3)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-3_CreatePantryTab)
- Display list of ingredients
    - [EWOK-38](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-38)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-38_DisplayIngredientList)
- Show empty pantry message
    - [EWOK-2](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-2)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-2_EmptyPantryMessage)
- Add a "Favorites" section to the main menu or profile
    - [EWOK-28](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-28)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-28_AddFavoritesSection)
- Add "Empty State" message for an empty list
    - [EWOK-29](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-29)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/feature%2FEWOK-29-EmptyStateMessage)
- Add "Favorites page" UI
    - [EWOK-24](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-24)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-24_FavoritesPageUI)

**Russell:** "Created and Tested Frontend and Backend Functionalities"

- Created Backend Flowchart Diagram
    - [EWOK-49](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-49)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/a5822bc87a4158dbf853c9452ad930b2ee395c04)
- Created Frontend Flowchart Diagram
    - [EWOK-50](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-50)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/branch/EWOK-50-frontend-flowchart)
- Added Dynamic Recipe List Manipulation + Random Recipe Button 
    - [EWOK-10](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-10)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/commits/56614e3bb2de9fb1fa84119a88e24c05051ef7f0)
- Scraped 301 Recipes from online API to JSON 
- Created REST API for commands to curl/post recipes
    - [EWOK-51](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-51)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/f7a3d63d8a50ec959c334ff549bd832acaf14031)

**Aaron:** "Provided backend objects and Spring Boot API to interact with them."

- Update pantry data from ingredient input
    - [EWOK-42](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-42)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-42-update-pantry-data-from-ingredient-input)
- Create data structure for storing favorited recipes
    - [EWOK-46](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-46)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-46-create-data-structure-for-storin)
- Create user object in backend
    - [EWOK-47](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-47)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-47-create-user-object-in-backend)
- Setup Spoonacular API calls
    - [EWOK-54](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-54)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-54-setup-spoonacular-api-calls)
- Create pantry API for frontend to work with backend
    - [EWOK-58](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-58)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-58-create-pantry-api-for-frontend-to-work-with-backend)

**Jeremiah:** "Implemented Functionality of Pantry Management UI"

- Create button and input field for ingredient addition. Connect it to the ingredient list UI.
    - [EWOK-1](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-1)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-1_IngredientInputUI)
- Parse ingredient input to handle multiple ingredients at once in different formats
    - [EWOK-41](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-41)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-41-add-multi-ingredient-input)
- Create button to remove ingredients from pantry
    - [EWOK-6](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-6)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-6-create-remove-ingredient-input)
    
**Dylan:** "Worked on API connections through Spring Boot & Spoonacular"

- Set up database connection
    - [EWOK-48](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-48)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-48-set-up-database-connection)
- Set up Spring Application on backend
    - [EWOK-4](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-4)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-4-set-up-spring-application-on-back)
- Cache Recipes in db
    - [EWOK-56](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-56)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-56-cache-recipes-in-db)
- Create Objects to store returned API information
    - [EWOK-53](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-53)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-53-create-objects-to-store-returned)
- Research OAuth 2 Spring integration
    - [EWOK-52](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-52)
- Add API connections for frontend to search recipes
    - [EWOK-57](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-57)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-57-add-api-connections-for-frontend)

## Sprint 2 (October 13 - October 24)
**Demo Branch:** dev
### Contributions

**Heston:** "Added JSON parsing files to support frontend/backend connections."

- Create JSON Ingredient Parser
    - [EWOK-68](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-68)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-68-create-json-ingredient-parser)
- Create JSON Recipe Parser
    - [EWOK-70](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-70)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-70-create-json-recipe-parser)
- Replace recipe service files with APU accessors
    - [EWOK-66](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-66)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/branch/EWOK-66-replace-service-files)
- Enable ability to tap a recipe card to open its details
    - [EWOK-30](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-30)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/branch/EWOK-30-open-recipe-details)
- Add UI input to favorite a recipe
    - [EWOK-7](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-7)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/branch/EWOK-7-add-favorite-UI-input)
    
**Dylan:** "Added security to the API through OAuth2."

- Add API security checks
    - [EWOK-85](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-85)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-85-add-api-security-checks)
- Set up OATH credentials
    - [EWOK-21](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-21)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-21-set-up-oath-credentials)
- Automate Gradle jar deployment
    - [EWOK-86](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-86)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-86-automate-gradle-jar-deployment)
- Add logout
    - [EWOK-22](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-22)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-22-add-logout)
- Connect OATH account to backend user
    - [EWOK-23](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-23)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/feature/EWOK-23-connect-oath-account-to-backend-)
- Update ingredient input with API parsing
    - [EWOK-87](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-87)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-87-backend-ingredient-api-endpoint)
    
**Jeremiah:** "Created interactive UI Designs and began implementation."

- Update Color Scheme
    - [EWOK-63](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-63)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-63-update-color-scheme)
- Creat navigation header/footer layout
    - [EWOK-67](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-67)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-67-create-navigation-header-footer-)
- Finalize color palette, fonts, and UI icons
    - [EWOK-73](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-73)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-73-finalize-color-palette-and-ui-ic)
- Create component for recipe suggestions
    - [EWOK-74](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-74)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-74-create-component-for-recipe-sugg)
- Design component for individual ingredients
    - [EWOK-77](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-77)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-77-design-component-for-individual-)
- Design "Add Ingredient" Popup considering autocomplete
    - [EWOK-78](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-78)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-78-design-add-ingredient-popup-cons)
- Design individual recipe description popup tab
    - [EWOK-79](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-79)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-79-design-individual-recipe-descrip)
- Review with team and refine based on feedback
    - [EWOK-83](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-83)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-83-review-with-team-and-refine-base)

**Aaron:** "Worked on the storage and management of the pantry in our database"

- Clean up Pantry Spring Boot calls
    - [EWOK-76](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-76)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-76-clean-up-pantry-spring-boot-call)
- Create SQL Calls for Backend Obj
    - [EWOK-39](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-39)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-39-create-sql-calls-for-backend-obj)
- Load Pantry Information from DB
    - [EWOK-84](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-84)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-84-load-pantry-information-from-db)
    
**Russell:** Unit tested full stack capabilities with as few blocks as possible
    - [EWOK-43](https://cs3398-ewoks-fall.atlassian.net/jira/software/projects/EWOK/list/?jql=project%20%3D%20%22EWOK%22%20ORDER%20BY%20created%20DESC&selectedIssue=EWOK-43)
    - [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/commits/2374fcb8d32b5cf539a0784a329b6c56dc902f5e)

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