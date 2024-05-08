import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import icons from 'url:../img/icons.svg'; // Parcel 2

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark the selected (active recipe) search result
    resultsView.update(model.getSearchResultsPage());

    // Updating bookmarks view for the selected(active) bookmarked recipe
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    // async function (controlRecipe) calling another async function (model.loadRecipe)
    // async function will return a promise, but this loadRecipe function does NOT return any value so we don't need to store any result to a variable
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    // .render() will accept the data that fetched in the model and then use this data to render the recipeView UI

    // If we export the entire class form recipeView, we have to do this
    // const recipeView = new recipeView(model.state.recipe)

    // TEMP
    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView);

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // console.log(goToPage);

  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination button
  paginationView.render(model.state.search);
};

// These controller function is basically the event handler which then will be executed whenever the event (click, or change) is happened in the user interface
// Determine the servings in the view and pass the value into the controller
const controlServings = function (newServings) {
  // 1）Update the recipe servings (in state)
  model.updateServings(newServings);

  // 2）Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// Add the bookmark for the recipe that is loaded
const controlAddBookmark = function () {
  // 1) Add/ remove bookmark: When the recipe is not yet / is bookmarked
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update bookmark view (render icons)
  // 这里的recipe.bookmarked = true, recipeView中的有书签的食谱视图的icon是filled状态，跟现有的icon不一致，所以我们需要update
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  // 当点击了书签icon后，我们需要将以收藏的食谱添加到书签列表中，bookmark View 负责渲染书签列表视图，所以我们将书签array（model.state.bookmarks）中的recipe对象传入前端进行视图渲染
  bookmarksView.render(model.state.bookmarks);
};

// Render the bookmarked view
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// Add the recipe from the user's uploaded recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // 0) Show loading spinner
    addRecipeView.renderSpinner();

    // 1) Upload the new recipe that got send back from the server
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // 2) Render recipe
    recipeView.render(model.state.recipe);

    // 3)Display successful upload message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    // 4) Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

// Publisher subscriber pattern:
// When the application started, the init function got called, and then the addHandlerRender was called (which is written in the view class, and then passing controlRecipe as handler)
const init = function () {
  // 需要在最开始就渲染书签列表视图
  bookmarksView.addHandlerRender(controlBookmarks);

  recipeView.addHandlerRender(controlRecipes);

  recipeView.addHandlerUpdateServings(controlServings);

  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  // Handle the upload recipe event
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();

// Subscriber
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
