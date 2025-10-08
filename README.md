# TasteBase
> *The go-to place to pick out your meals. Just pick an ingredient (or more) and let us find you recipes!*

Aaron Espinoza, Heston Montagne, Dylan Priebe, Jeremiah Stone, and Russell Sullivan are working together to create a web-app that connects users who want to improve their cooking skills to recipes that are relevant to their tastes and available ingredients. The goal of the app is to make cooking feel easier for aspiring cooks who find the process daunting by simplifying the research step.

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
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


# Features

### Pantry Tracking
This feature allows users to add and remove ingredients from their personal pantry so they can easily track their available ingredients. 

***Corresponding Stories***

- As a general user, I want to view a list of my ingredients so that I can easily track my available ingredients for cooking. 

- As a general user, I want to add ingredients to my pantry so that I can keep my pantry up to date when I buy new food items. 

- As a general user, I want to delete ingredients from my pantry so that I can keep my pantry up to date as I use or get rid of food items.


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
### Contributions
**Heston:** "Provided UI for the pantry list and recipe tab to display recipes to the user"
* Create pantry view tab
    * [EWOK-3](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-3)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-3_CreatePantryTab)
* Display list of ingredients
    * [EWOK-38](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-38)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-38_DisplayIngredientList)
* Show empty pantry message
    * [EWOK-2](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-2)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-2_EmptyPantryMessage)
* Add a "Favorites" section to the main menu or profile
    * [EWOK-28](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-28)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-28_AddFavoritesSection)
* Add "Empty State" message for an empty list
    * [EWOK-29](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-29)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/feature%2FEWOK-29-EmptyStateMessage)
* Add "Favorites page" UI
    * [EWOK-24](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-24)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/branch/EWOK-24_FavoritesPageUI)

**Russell:** "Created and Tested Frontend and Backend Functionalities"
* Created Backend Flowchart Diagram
    * [EWOK-49] https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-49
    * [Bitbucket] https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/a5822bc87a4158dbf853c9452ad930b2ee395c04
* Created Frontend Flowchart Diagram
    * [EWOK-50] https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-50
    * [Bitbucket] https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/branch/EWOK-50-frontend-flowchart
* Added Dynamic Recipe List Manipulation + Random Recipe Button 
    * [EWOK-10] https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-10
    * [Bitbucket] https://bitbucket.org/cs3398-ewoks-f25/%7B00a23602-999a-417c-ad02-e42303873d5e%7D/commits/56614e3bb2de9fb1fa84119a88e24c05051ef7f0
* Scraped 301 Recipes from online API to JSON 
* Created REST API for commands to curl/post recipes
    * [EWOK-51] https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-51
    * [Bitbucket] https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/commits/f7a3d63d8a50ec959c334ff549bd832acaf14031

**Aaron:** "Provided backend objects and Spring Boot API to interact with them."
* Update pantry data from ingredient input
    * [EWOK-42](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-42)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-42-update-pantry-data-from-ingredient-input)
* Create data structure for storing favorited recipes
    * [EWOK-46](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-46)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-46-create-data-structure-for-storin)
* Create user object in backend
    * [EWOK-47](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-47)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-47-create-user-object-in-backend)
* Setup Spoonacular API calls
    * [EWOK-54](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-54)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-54-setup-spoonacular-api-calls)
* Create pantry API for frontend to work with backend
    * [EWOK-58](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-58)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-58-create-pantry-api-for-frontend-to-work-with-backend)

**Jeremiah:** "Implemented Functionality of Pantry Management UI"
* Create button and input field for ingredient addition. Connect it to the ingredient list UI.
    * [EWOK-1](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-1)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-1_IngredientInputUI)
* Parse ingredient input to handle multiple ingredients at once in different formats
    * [EWOK-41](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-41)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-41-add-multi-ingredient-input)
* Create button to remove ingredients from pantry
    * [EWOK-6](https://cs3398-ewoks-fall.atlassian.net/browse/EWOK-6)
    * [Bitbucket](https://bitbucket.org/cs3398-ewoks-f25/ewoks3398project/branch/EWOK-6-create-remove-ingredient-input)

## Project Status
Project is: _in progress_


## Room for Improvement

### Testing:
- Unit test for add ingredient to pantry react native input
- Unit test for remove ingredient from pantry react native input
- Unit test for tab navigation

### Features:
- Feature to be added 1
- Feature to be added 2

### Recipe Recommendation:
- Recommend recipes based on different cultures. For example, when the user asks for Indian or Greek recipes.
- Recommend recipes based on food nutrients. For example, when the user asks for high-protein, high carbohydrate, zero-carbohydrate(keto), low-fat, low sugar, high sugar, etc.
- When the user has nothing in their pantry, ask them what kind of food they might want and give recommendations based off this initial user input


<!-- ## Acknowledgements
Give credit here.
- This project was inspired by...
- This project was based on [this tutorial](https://www.example.com).
- Many thanks to... -->



<!-- Optional -->
<!-- ## License -->
<!-- This project is open source and available under the [... License](). -->

<!-- You don't have to include all sections - just the one's relevant to your project -->