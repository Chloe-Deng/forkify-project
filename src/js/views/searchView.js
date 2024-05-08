class SearchView {
  // Get the query and listen the click event on the search button
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // view(publisher) Listen the event in the view and pass the controller(subscriber)handler function
  addHandlerSearch(handler) {
    // When we submit a form, we need to first prevent the default action in order to prevent the page reload as we submit the form, and then we pass the handler function

    // submit event: user click or hit the enter
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
