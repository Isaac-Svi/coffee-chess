const queryParams = Object.fromEntries(new URLSearchParams(window.location.search))

if ('error' in queryParams) {
    const err = document.querySelector('.error')
    err.classList.add('show')
    err.innerText = queryParams.error
}
