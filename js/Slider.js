class AsyncSliderWithPagination {
    constructor(callbackPromise, ctnrSelector, perPage) {
        this.$ctnr = document.querySelector(ctnrSelector);
        this.currentSlide = 0;
        this.$slidesCtnr = document.createElement('div');
        this.perPage = perPage;
        this.canSlide = true;
        this.callbackPromise = callbackPromise;
        this.callbackPromise(1)
        .then(({slides, totalPages}) => {
            this.slides     = slides;
            this.totalPages = totalPages;
            this.init();
            this.displaySlides();
        })
        .catch(err => {
            alert('Une erreur est survenue');
            console.log(err);
        });
    }

    init() {
        this.$slidesCtnr.className = 'my-slider-ctnr';
        this.$slidesCtnr.style.display = 'flex';
        this.$slidesCtnr.style.height = 'calc(100% - 40px)';
        this.$slidesCtnr.style.width = `${this.slides.length}00%`;

        const $slideBtnsCtnr = document.createElement('div');
        $slideBtnsCtnr.className = 'slider-nav-btns-ctnr';
        const $slideBtnLeft = document.createElement('i');
        $slideBtnLeft.innerText = 'Précédent';
        $slideBtnLeft.addEventListener('click', () => { this.slideLeft(); });
        $slideBtnsCtnr.appendChild($slideBtnLeft);
        const $slideBtnRight = document.createElement('i');
        $slideBtnRight.innerText = 'Suivant';
        $slideBtnRight.addEventListener('click', () => { this.slideRight(); });
        $slideBtnsCtnr.appendChild($slideBtnRight);
        
        const $paginationCtnr = document.createElement('nav');
        $paginationCtnr.className = 'pagination-nav-ctnr';
        new Pagination($paginationCtnr, this);
       
        this.$ctnr.appendChild($slideBtnsCtnr);
        this.$ctnr.appendChild(this.$slidesCtnr);
        this.$ctnr.appendChild($paginationCtnr);
    }

    displaySlides() {
        this.$slidesCtnr.innerHTML = '';
        this.slides.forEach((slide, i) => {
            const $slideElt = document.createElement('div');
            $slideElt.className = 'slide-img';
            $slideElt.style.backgroundImage = 'url("' + slide.src + '")';
            const $slideTxtElt = document.createElement('div');
            $slideTxtElt.className = 'slide-img-txt';
            $slideTxtElt.innerHTML = slide.txt;
            $slideElt.appendChild($slideTxtElt);
            this.$slidesCtnr.appendChild($slideElt);

            if (i === 0) {
                $slideTxtElt.style.animation = 'card-appearence 0.4s linear forwards 2s';
            }
        });
    }

    loadItems(pageNumber) {
        this.callbackPromise(pageNumber)
        .then(({slides}) => {
            this.slides         = slides;
            this.displaySlides();
        })
        .catch(err => {
            alert('Une erreur est survenue');
            console.log(err);
        });
    }

    slideLeft() {
        if(!this.canSlide || this.currentSlide === 0) {
            return;
        }

        this.canSlide = false;
        let marginLeft  = this.currentSlide * -100;
        const limit     = marginLeft + 100;
 
        const interval = window.setInterval(() => {
            marginLeft += 2;
            this.$slidesCtnr.style.marginLeft = marginLeft + '%';

            if(marginLeft >= limit) {
                this.currentSlide --;
                this.canSlide = true;
                window.clearInterval(interval);
            }
        }, 20);
    }

    slideRight() {
        if(!this.canSlide || this.currentSlide === this.perPage - 1) {
            return;
        }

        this.canSlide = false;
        let marginLeft  = this.currentSlide * -100;
        const limit     = marginLeft - 100;
 
        const interval = window.setInterval(() => {
            marginLeft -= 2;
            this.$slidesCtnr.style.marginLeft = marginLeft + '%';

            if(marginLeft <= limit) {
                this.currentSlide ++;
                this.canSlide = true;
                window.clearInterval(interval);
            }
        }, 20);
    }
}

class Pagination {
    constructor(paginationCtnr, ctxt) {
        this.currentPage = 1;
        this.totalPageNumber = ctxt.totalPages;
        this.$ul = document.createElement('ul');
        paginationCtnr.appendChild(this.$ul);
        this.init(ctxt);
    }

    init(ctxt) {
        this.$ul.innerHTML = '';
        if(this.totalPageNumber <= 10) {
            for(let i = 1; i <= this.totalPageNumber; i ++) {
                this.createPageNumber(i, ctxt);
            }
        } else if(this.currentPage <= 6) {
            for(let i = 1; i <= 10; i ++) {
                this.createPageNumber(i, ctxt);
            }
            const $li = document.createElement('li');
            this.$ul.appendChild($li);
            $li.innerText = '...';

            this.createPageNumber(this.totalPageNumber, ctxt);
        } else {
            this.createPageNumber(1, ctxt);
            const $li = document.createElement('li');
            this.$ul.appendChild($li);
            $li.innerText = '...';
            for(let i = this.currentPage - 4; i <= this.currentPage + 4; i ++) {
                this.createPageNumber(i, ctxt);
                if(i === this.totalPageNumber) {
                    break;
                }
            }
            if(this.currentPage + 4 < this.totalPageNumber) {
                if(this.currentPage + 4 < this.totalPageNumber - 1) {
                    const $li = document.createElement('li');
                    this.$ul.appendChild($li);
                    $li.innerText = '...';
                }
                this.createPageNumber(this.totalPageNumber, ctxt);
            }
        }
    }

    createPageNumber(pageNumber, ctxt){
        const $li = document.createElement('li');
        this.$ul.appendChild($li);
        const $btn = document.createElement('button');
        $btn.innerText = pageNumber;
        $li.appendChild($btn);
        $btn.addEventListener('click', () => {
            ctxt.loadItems(pageNumber);
            this.currentPage = pageNumber;
            this.init(ctxt);
        });
    }
}