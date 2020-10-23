class Slider {
    constructor(callbackPromise, ctnrSelector, perPage) {
        this.$ctnr = document.querySelector(ctnrSelector);
        this.currentSlide = 0;
        this.$slidesCtnr = document.createElement('div');
        this.perPage = perPage;
        this.canSlide = true;
        this.callbackPromise = callbackPromise;
        this.callbackPromise(1)
        .then(slides => {
            this.slides = slides;
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
        $paginationCtnr.className = 'slider-pagination-nav';
        new Pagination();
       
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
    constructor(paginationCtnr, totalPageNumber) {
        this.totalPageNumber = totalPageNumber;
        this.$ul = document.createElement('ul');
        paginationCtnr.appendChild(this.$ul);
        this.init();
    }

    init() {

    }
}