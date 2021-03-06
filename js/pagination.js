import {movieListContainerEl, page} from './variables.js'
import {fetchSearchInput, fetchMovieInfo, renderMovieHtml, createListButton, changeButtonIcon} from './utils.js'

function createPagination() {
    let highestPageNumber = 5
    let lowestPageNumber = 1
    renderPagination(highestPageNumber, lowestPageNumber)
    handleButtons(highestPageNumber, lowestPageNumber) 
}

function renderPagination(highestPageNumber, lowestPageNumber) {
    const paginationEl = document.querySelector('#pagination')
    paginationEl.style.display = "block"
    paginationEl.innerHTML = ''
    let pageNumberButtonsHtml = ""
    let paginationHtml = ""

    for (let i = highestPageNumber - 5; i < highestPageNumber; i++) {
        if (i+1 === 1) {
            pageNumberButtonsHtml += `
            <button class="page-number active" data-index= ${i + 1} >${i + 1}</button>
            `  
        } else {
            pageNumberButtonsHtml += `
            <button class="page-number" data-index= ${i + 1} >${i + 1}</button>
            `      
        }
    } 
    paginationHtml = `
        ${highestPageNumber !== 5 ? `<button class="page-number" data-index=${highestPageNumber - 5}>&laquo;</button>` : ""}  
        ${pageNumberButtonsHtml}
        <button class="page-number" data-index=${highestPageNumber + 1}>&raquo;</button>
    `
    paginationEl.innerHTML = paginationHtml

    handleButtons(highestPageNumber, lowestPageNumber)
}


function handleButtons(highestPageNumber, lowestPageNumber) {
    const pageNumberButton = document.querySelectorAll('.page-number')
    pageNumberButton.forEach(button => {
        button.addEventListener('click' , (e) => {
            const pageNumber = e.target.dataset.index
            if (pageNumber > highestPageNumber) {                
                highestPageNumber += 5
                lowestPageNumber +=5
                renderPagination(highestPageNumber, lowestPageNumber)
            } else if (pageNumber < lowestPageNumber) {
                highestPageNumber -= 5
                lowestPageNumber -=5
                renderPagination(highestPageNumber, lowestPageNumber)
            }
            
            addActiveState(pageNumber)

            movieListContainerEl.innerHTML = `
            <div class="display-message">
                <p>Loading...</p>
            </div>`
    
            const searchInput = document.querySelector('#search-input')

            function awaitReturn() {
                return fetchSearchInput(searchInput.value, pageNumber)
            }

            (async () => {
                const movieIdArr = await awaitReturn()
                if (movieIdArr) {
                    const movieInfoHtml = await fetchMovieInfo(movieIdArr)
                    renderMovieHtml(movieInfoHtml)
                    createListButton()
                    page === "index" && changeButtonIcon(movieIdArr)
                }           
            })()

        })
    })
}

function addActiveState(pageNumber) {
    const paginationContainer = document.querySelector('#pagination')
    const pageButton = paginationContainer.querySelectorAll('.page-number')

    pageButton.forEach(button => {
        if (button.textContent === pageNumber) {
            const current = paginationContainer.querySelector('.active')
            if (current) {
                current.classList.remove('active')
            }
            button.classList.add('active')
        }
    })
}

export {createPagination}