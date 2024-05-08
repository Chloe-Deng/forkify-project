import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice bookmark and mark it.';
  _message = '';

  // Render the bookmark view before update the bookmark view
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // 如果直接用 previewView.render(bookmark）则 render 不会返回一个 markup string，所以在要先将render 设置为 false， 则这里会返回一个 preview 的 markup, 然后在这个方程中我最后我们就得到一个markup string 供 render（渲染）页面使用
  _generateMarkup() {
    // console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
