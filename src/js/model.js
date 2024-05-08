import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

// import { TIMEOUT_SEC } from './config.js';

// async function only runs in the background which is NOT blocking the execution thread
// Use await inside the async function will pause the execution and wait for the fetch response
// .json() is available on all response object, it return another promise and we have to await again and stored in the data variable
// 如果在一个 async 函数中使用 throw new Error(...)，throw 抛出一个异常，它会导致该 async/await 函数返回一个 rejected 的 Promise 对象。

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// Create an object for the uploaded newly created recipe
export const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    // 短路原则：如果 recipe.key 为 false，那么 && 后面的不执行，如果 recipe.key 为真， 那么继续执行 && 后面的代码然后返回一个值，再用spread operator 将 { key: recipe.key } 解构为 key: recipe.key
  };
};

// Update or change the state object
export const loadRecipe = async function (id) {
  try {
    // 通过调用 getJSON 函数获取指定id食谱的数据
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    console.log(data);

    state.recipe = createRecipeObject(data);

    // 解构从 API 返回的数据中的 recipe 对象
    // const { recipe } = data.data;

    // 将获取的食谱数据存储到 state.recipe 对象中
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };

    // console.log(state.recipe);

    // Mark any recipe that has been loaded from the API as bookmarked if it is already in the bookmarks array (如果从API中加载的recipe已经被收藏在书签array中，我们就将这个recipe对象的bookmarked属性设置为true)
    // Check if the current recipe id is same as the id in the bookmarks array
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥`);

    // Throw error in order to use in the controller
    throw err;
  }
};

// This function does NOT return any value, it only manipulate the state
export const loadSearchResults = async function (query) {
  try {
    // Keep in sync with the query in the UI
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    // Update the state: Store the data in the results
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // When the user search another query, the result page should be set back to page 1
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

// 根据当前页码显示搜索结果中的特定范围
// Reach into the state and then get the data for page
// Return apart of the result
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9 // .slice() does not include the last value
  console.log(state.search.results);
  return state.search.results.slice(start, end);
};

// Reach into the state.recipe.ingredients and then change the quantity in each ingredient
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4
  });

  // Update the old (current) serving after changing the serving
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  console.log(state.bookmarks);

  // Mark the current recipe as bookmark
  // （确保当用户将某个食谱添加到书签中时，这是一个用户与应用程序进行交互的动作。这个交互动作会导致更新 state 对象，确保 state 中的数据与用户的期望保持一致）
  // state.recipe.id: 当前食谱对象
  // 查看新添加到书签列表的 recipe.id 和当前显示的食谱的 id 是否相等
  // 如果相等，将 state.recipe.bookmarked 设置为 true。这表示当前显示的食谱已被书签收藏 (更新当前应用程序的状态)。
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Store the data in the local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete the bookmarked recipe in the bookmarks array
  // 如果应用程序状态中的 bookmarks 中 recipe 的id 与将要删除的 recipe 的 id 一样，就把 这个recipe 从当前书签的array中删除
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // Mark the current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// 将前端收集并整理后的上传表单数据再进行处理，主要将ingredients 的数据进行处理，然后通过 Fetch API 发送了一个 POST 请求，将 JSON 格式的表单数据上传到指定的服务器端 URL进行处理，服务器接收到数据后进行处理，最后返回响应给前端
// Get the uploaded recipe form the API
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));

    // Object.entries(): convert object to array and then filter out the ingredients array

    // array method:
    // .filter() 根据回调函数定义的过滤条件，返回一个满足条件的新数组，不改变原数组
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // ing[1].split(','): 将字符串按逗号 , 进行分割，得到一个包含分割后子字符串的数组。
        // .map(el => el.trim()): 对数组中的每个元素执行 trim() 操作，移除每个元素两端的空白字符，得到一个新的数组。
        const ingArr = ing[1].split(',').map(el => el.trim());

        // 对 array 解构赋值，将数组 ing 中第二个元素提取出来 ing[1] 还是一个数组，包含三个 string，并将这些值赋值给 quantity，unit， description 三个变量。将空格全部替换成空字符串，然后用逗号隔开，最后返回这三个变量组成的对象。
        // const ingArr = ing[1].replaceAll(' ', '').split(',');

        // Check the user input formatting (5,,)
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients); // arrays in an array

    // Formatting the upload recipe object
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Send the data to the server and receive the data coming back from the API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // console.log(data);
    state.recipe = createRecipeObject(data);

    // User uploaded recipe will be automatically
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
// 6dc00915-70c0-4303-8020-f7f369d9ba87
