import { useEffect } from 'react';
import './book.css';

export default function FlipBook() {
  useEffect(() => {
    const pages = document.getElementsByClassName('page');
    const arrow = document.getElementById('arrow');

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      if (i % 2 === 0) {
        page.style.zIndex = pages.length - i;
      }
    }

    for (let i = 0; i < pages.length; i++) {
      pages[i].pageNum = i + 1;
      pages[i].onclick = function () {
        // Hide arrow on first interaction
        if (arrow && !arrow.classList.contains('hidden')) {
          arrow.classList.add('hidden');
        }

        if (this.pageNum % 2 === 0) {
          this.classList.remove('flipped');
          this.previousElementSibling.classList.remove('flipped');
        } else {
          this.classList.add('flipped');
          this.nextElementSibling.classList.add('flipped');
        }
      };
    }
  }, []);

  return (
    <div className="book-wrapper">
      <div id="arrow" className="arrow-right">→</div>
      <div className="book small-book">
        <div id="pages" className="pages">
          <div className="page" style={{ backgroundImage: "url(/1pg.jpg)" }}></div>
          <div className="page" style={{ backgroundImage: "url(/2pg.jpg)" }}></div>
          <div className="page" style={{ backgroundImage: "url(/3pg.jpg)" }}></div>
          <div className="page" style={{ backgroundImage: "url(/4pg.jpg)" }}></div>
        </div>
      </div>
    </div>
  );
}
