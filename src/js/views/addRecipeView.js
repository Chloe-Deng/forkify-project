import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe is successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    // 调用 super()，执行父类的构造函数, this 指向的是正在创建的对象实例。
    // 子类的构造函数可以通过 this 访问父类的属性和方法，并且可以在构造过程中进行一些初始化工作
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // 事件监听器中的回调函数的this指向监听器绑定的元素
  // this.toggleWindow.bind(this) 创建了一个新的函数，该函数与 toggleWindow 函数相同，但 this 被绑定到当前对象上。 bind(this) 中的 this 表达式指向了当前对象，即在当前上下文中的对象。
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // Upload form and get the uploaded data
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      console.log(e.target);

      e.preventDefault();

      // 在前端整理和准备好表单数据的格式：使用 FormData 对象收集表单中的数据, 将数组转换为对象
      // this points to the form element(parentElement)
      const dataArr = [...new FormData(this)];

      // Convert array to object
      const data = Object.fromEntries(dataArr);
      // console.log(dataArr);
      console.log(data);

      // 将整理好的 data 传递给 handler，handler函数中会有将 data 发送给服务器的逻辑
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
