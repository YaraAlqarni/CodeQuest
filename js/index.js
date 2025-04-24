/*=============== SHOW MENU ===============*/

const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
   navToggle.addEventListener('click', () =>{
      navMenu.classList.add('show-menu')
   })
}

/* Menu hidden */
if(navClose){
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
   })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
   const navMenu = document.getElementById('nav-menu')
   // When we click on each nav__link, we remove the show-menu class
   navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== SWIPER HOME ===============*/ 
const swiperHome = new Swiper('.home__swiper', {
   pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: (index, className) => {
         return '<span class="' + className + '">' + String(index + 1).padStart(2, '0') + "</span>"
      },
   },

   autoplay: {
      delay: 5000,
   },
})

/*=============== CHANGE BACKGROUND HEADER ===============*/
const bgHeader = () =>{
   const header = document.getElementById('header')
   // Add a class if the bottom offset is greater than 50 of the viewport
   this.scrollY >= 50 ? header.classList.add('bg-header') 
                      : header.classList.remove('bg-header')
}
window.addEventListener('scroll', bgHeader)

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						     : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
  	const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
			  sectionTop = current.offsetTop - 58,
			  sectionId = current.getAttribute('id'),
			  sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
   origin: 'top',
   distance: '60px',
   duration: 2000,
   delay: 300,
   // reset: true, // Animations repeat
})

sr.reveal(`.home__bg`, {scale: 1.1, opacity: 1})
sr.reveal(`.home__swiper`, {origin: 'right', distance: '300px', delay: 800})
sr.reveal(`.home__data`, {origin: 'bottom', delay: 1600, distance: '120px'})
sr.reveal(`.swiper-pagination-bullet`, {origin: 'top', delay: 1800, opacity: 0})
sr.reveal(`.home__button`, {origin: 'top', delay: 2200})
sr.reveal(`.about__data, .contact__content`, {origin: 'left'})
sr.reveal(`.about__video, .contact__img`, {origin: 'right'})
sr.reveal(`.models__card`, {interval: 100})
sr.reveal(`.info__img`, {distance: '120px'})
sr.reveal(`.info__number`, {origin: 'bottom', distance: '80px', delay: 800})
sr.reveal(`.info__group`, {interval: 100, delay: 1300})
sr.reveal(`.footer__container`)
/*=============== EDITOR SECTION SCROLL REVEAL ===============*/
sr.reveal(`.models__image-wrapper`, {
   origin: 'left',
   distance: '100px',
   duration: 1500,
   delay: 200,
   reset: true // ensures it animates when scrolled into view again
})

sr.reveal(`.models__text-wrapper`, {
   origin: 'right',
   distance: '100px',
   duration: 150,
   delay: 100,
})

/*=============== TYPING EFFECT ===============*/
var typingEffect = new Typed(".typedText", {
   strings: ["CODE QUEST"],
   loop: true,
   typeSpeed: 100,
   backSpeed: 80,
   backDelay: 500
});
/*=============== LANGUAGE LOGO INTERACTIVITY ===============*/
const logos = document.querySelectorAll('.info__logo')

logos.forEach(logo => {
   logo.addEventListener('mouseenter', () => {
      logo.style.transform = 'scale(1.2)'
   })

   logo.addEventListener('mouseleave', () => {
      logo.style.transform = 'scale(1)'
   })
})
