import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup is returned if render=false
   * @this {Object} View instance
   * @author Chloe Deng
   * @todo Finished implementation
   */
  render(data, render = true) {
    // If there is no data OR if there is data, but the data is an array AND it's empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    // 如果 render 参数的值为 false，则直接返回生成的 HTML 字符串 markup。将用到这个返回previewView 的 markup string， 这样我们就可以在 preview 中用到 this._data
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    // Once updated the data, we want the view's data become the new data
    this._data = data;

    // use new data to create this new markup in order to compare with the old version, then change the text and attributes
    const newMarkup = this._generateMarkup(); // string

    // Create a virtual dom of the new markup (html string)
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Select all the new dom elements
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // Select current dom elements(nodes)
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // console.log(newElements, curElements);

    // Compare current
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Update changed TEXT
      // Guard clause: if newEl and curEL is different and the newEl's first node is text, update the current element's content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
