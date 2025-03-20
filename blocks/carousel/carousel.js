export default function decorate(block) {
  block.classList.add('swiper-wrapper');
  [...block.children].forEach((row) => {
    if (row.getAttribute('data-aue-model') === 'carouselSlide') {
      row.classList.add('swiper-slide');
      const classes = ['image', 'text','link'];
      classes.forEach((e, j) => {
        row.children[j].classList.add(`carousel-${e}`);
      });
    }
    if (row.getAttribute('data-aue-model') === 'title') {
      row.classList.add('carousel-header');
    }
  });

  const previousButton = document.createElement('div');
  const nextButton = document.createElement('div');
  previousButton.classList.add('swiper-button-prev');
  nextButton.classList.add('swiper-button-next');

  if (block.classList.contains('carousel')) {
    previousButton.classList.add('carousel-prev');
    nextButton.classList.add('carousel-next');

    const swiperSlides = block.querySelectorAll('.swiper-slide');

    swiperSlides.forEach((slide) => {
      const anchorElement = document.createElement('a');
      slide.appendChild(anchorElement);

      const carouselImageDiv = slide.querySelector('.carousel-image');
      const carouselTextDiv = slide.querySelector('.carousel-text');
      const carouselButtonDiv = slide.querySelector('.carousel-link');

      anchorElement.appendChild(carouselImageDiv);
      anchorElement.appendChild(carouselTextDiv);
      anchorElement.appendChild(carouselButtonDiv);
      slide.appendChild(anchorElement);

      slide.querySelector('.carousel-link .button').textContent = 'READ MORE';
    });
  } else {
    previousButton.classList.add('feature-prev');
    nextButton.classList.add('feature-next');
  }

  block.parentElement.appendChild(previousButton);
  block.parentElement.appendChild(nextButton);

  // For Carousel -
  const slides = document.querySelectorAll('.swiper-slide');
  const nextSlide = document.querySelector('.swiper-button-next.carousel-next');
  const prevSlide = document.querySelector('.swiper-button-prev.carousel-prev');
  const totalSlides = slides.length;
  let curSlide = 0;

  function getSlidesPerScroll() {
    if (window.innerWidth <= 768) {
      return 1; // Mobile: 1 slide
    }
    if (window.innerWidth < 1024) {
      return 2; // Tablet: 2 slides
    }
    return 3; // Desktop: 3 slides
  }
  const slidesPerScroll = getSlidesPerScroll();

  // Function to update slide positions and visibility
  function updateSlides() {
    slides.forEach((slide, indx) => {
      const position = indx - curSlide;
      // Show only slides within the range
      if (position >= 0 && position < slidesPerScroll) {
        slide.classList.remove('hidden-slide');
      } else {
        slide.classList.add('hidden-slide');
      }
    });
  }
  // Set initial positions
  updateSlides();
  // Next slide event listener
  nextSlide.addEventListener('click', () => {
    if (curSlide + slidesPerScroll >= totalSlides) {
      curSlide = 0;
    } else {
      curSlide += slidesPerScroll;
    }
    updateSlides();
  });
  // Previous slide event listener
  prevSlide.addEventListener('click', () => {
    if (curSlide === 0) {
      curSlide = totalSlides - slidesPerScroll;
    } else {
      curSlide -= slidesPerScroll;
      if (curSlide < 0) curSlide = 0;
    }
    updateSlides();
  });
}
