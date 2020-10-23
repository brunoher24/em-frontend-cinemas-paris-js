const BACKEND_URL   = 'http://localhost:3000/api/series/list/';
const urlImgPrefix  = 'https://image.tmdb.org/t/p/w500';

const loadSeries = pageNumber => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', BACKEND_URL + pageNumber);
            xhr.send(null);
            
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.response);
                    const tvShows = response.results;
                    
                    const slides = tvShows.map(show => {
                        return { src: urlImgPrefix + show.poster_path, txt: `<h5>${show.name}</h5><p>${show.overview}</p>` }
                    });     
                    resolve({slides, totalPages: response.total_pages});
                } else {
                    reject({msg: 'Bad status', status: xhr.status});
                }
            });
    
            xhr.addEventListener('error', e => { 
                reject(e);
            });
        });

        
}


new AsyncSliderWithPagination(loadSeries, '.my-slider', 20);
