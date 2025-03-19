export default function decorate(block) {
  block.classList.add('swiper-wrapper');
  [...block.children].forEach((row) => {
    row.classList.add('swiper-slide');
    const classes = ['image', 'text'];

    classes.forEach((e, j) => {
      row.children[j].classList.add(`carousel-${e}`);
    });
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

      anchorElement.appendChild(carouselImageDiv);
      anchorElement.appendChild(carouselTextDiv);
      slide.appendChild(anchorElement);
    });
  } else {
    previousButton.classList.add('feature-prev');
    nextButton.classList.add('feature-next');
  }

  block.parentElement.appendChild(previousButton);
  block.parentElement.appendChild(nextButton);
}
