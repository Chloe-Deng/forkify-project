import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// Return a promise that will reject after a few seconds passed
// 在这个 Promise 的执行器函数中，使用了 setTimeout 函数。setTimeout 会在指定的时间后执行传入的函数。在这里，经过 s * 1000 毫秒后，会执行一个函数，这个函数会调用 reject，并传递一个 Error 对象作为拒绝原因。这个 Error 包含了一个描述超时的错误信息。
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status}) 💥💥💥`);

    // This sendJSON async function return the data variable which is going to be the resolved value of the promise that the sendJSON function returned
    return data;
  } catch (err) {
    // Throw err in order to Handle the error in the model.js loadRecipe function
    throw err;
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // console.log(data);

    if (!res.ok) throw new Error(`${data.message} (${res.status}) 💥💥💥`);

    // This getJSON async function return the data variable which is going to be the resolved value of the promise that the getJSON function returned
    return data;
  } catch (err) {
    // Throw err in order to Handle the error in the model.js loadRecipe function
    throw err;
  }
};

// 使用 Fetch API 的方法，通过 HTTP POST 请求将表单数据以 JSON 格式提交给服务器。后端服务器可以解析这个 JSON 数据，并执行相应的处理逻辑
// fetch(url, options) 是 Fetch API 提供的函数，用于发起网络请求。第一个参数是请求的 URL，第二个参数是一个配置对象，包含请求的各种选项，如请求方法、头部信息、请求体等。
// method: 'POST' 指定了这是一个 POST 请求，headers 部分设置了请求头，其中 'Content-Type': 'application/json' 表示请求体的格式是 JSON。
// body: JSON.stringify(uploadData) 设置了请求体，将 uploadData 对象转换为 JSON 格式的字符串。

// Use fetch API method to send the data to server in (post request)
// Header: The sending content type should be in JSON, which means the API only accept the correct data and create a bew recipe in the database
// Body: the data that we want to send, and the body should be in JSON.(convert object to JASON string)
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // Receive (await) the data coming back (the API will return the data back that we just sent)
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status}) 💥💥💥`);

    // This sendJSON async function return the data variable which is going to be the resolved value of the promise that the sendJSON function returned
    return data;
  } catch (err) {
    // Throw err in order to Handle the error in the model.js loadRecipe function
    throw err;
  }
};
*/
