openBtn = document.querySelector('.responsiveOpenBtn');
closeBtn = document.querySelector('.closeNavBar');
document.querySelector('.responsiveOpenBtn')

navbar = document.getElementById('navbar');

openBtn.addEventListener('click', () => {
    navbar.classList.toggle('openNavbar');
    navbar.classList.toggle('logoNav');
});
closeBtn.addEventListener('click', () => {
    navbar.classList.toggle('openNavbar');
    navbar.classList.toggle('logoNav');
});


