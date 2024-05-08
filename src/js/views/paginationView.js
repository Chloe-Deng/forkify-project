import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // console.log(e.target);
      const btn = e.target.closest('.btn--inline');

      // 如果点击事件发生在 button 元素以外的地方，e.target 将是点击事件的目标元素，但由于closest 没有找到带有 .btn--inline 类的父元素，closest 返回 null, 为了避免发生错误，我们需要立即 return
      if (!btn) return;
      // console.log(btn);

      const goToPage = +btn.dataset.goto; // Convert to num
      // console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      // Create a custom data attribute on each of the button, which will contain the page that we want to go
      return `
      
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      <span class="pagination__page-number">Page ${curPage} of ${numPages}</span>
      `;

      // return this._generateButtonNext(curPage);
    }

    // Last page
    // 当前页码等于总页数，且在页数等于 1 时不会认为是最后一页
    if (curPage === numPages && numPages > 1) {
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        
        <span>Page ${curPage - 1}</span>
      </button>
      <span class="pagination__page-number">Page ${curPage} of ${numPages}</span>
      `;

      // return this._generateButtonPre(curPage);
    }

    // Other page
    if (curPage < numPages) {
      return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
      <span class="pagination__page-number">Page ${curPage} of ${numPages}</span>
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button> 
      `;
    }

    // Page 1, and there are NO other page
    return '';
  }
}

export default new PaginationView();
