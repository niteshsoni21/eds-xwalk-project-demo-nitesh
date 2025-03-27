export default async function decorate(block) {
  block.classList.add('variant-details');

  const response = await fetch('/graphql/execute.json/eds-nitesh-demo/carVariantList', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const carVariantList = await response.json();

  carVariantList.data.carVariantList.items.forEach((variant) => {
    const variantDiv = document.createElement('div');
    variantDiv.classList.add('variant-card');

    const imagePath = Object.values(variant.variantImage)[0];

    variantDiv.innerHTML = `
      <div class="card-top">
        <img src='${imagePath}' alt='${variant.variantTitle}' class='variant-img' />
        <div class='variant-share-section'>
          <p class='variant-share-text'>Share</p>
          <div class='top-selling-container ${variant.topSelling}'>
            <p class='top-selling-text'>Top Selling</p>
          </div>
        </div>
      </div>
      <div class='variant-desc'>
        <p class='variant-title'>${variant.variantTitle}</p>
        <div class="variant-price-section">
          <p class='variant-price'>${variant.variantPrice}</p>
          <p class='variant-price-text'>${variant.variantPriceLocation}</p>
        </div>
        <p class='variant-feature'>Features</p>
        ${variant.variantFeatures.html}
      </div>
    `;
    block.appendChild(variantDiv);
  });

  [...block.children].forEach((row) => {
    if (row.getAttribute('class') === 'variant-card') {
      row.classList.add('swiper-slide');
    }
    if (row.getAttribute('data-aue-prop') === 'title') {
      row.classList.add('recommended-variants-header');
    }
  });

  const previousButton = document.createElement('div');
  const nextButton = document.createElement('div');
  previousButton.classList.add('swiper-button-prev');
  nextButton.classList.add('swiper-button-next');

  if (block.classList.contains('recommended-variants')) {
    previousButton.classList.add('variants-prev');
    nextButton.classList.add('variants-next');

    const swiperSlides = block.querySelectorAll('.swiper-slide');

    swiperSlides.forEach((slide) => {
      const anchorElement = document.createElement('a');
      slide.appendChild(anchorElement);

      const variantsImageDiv = slide.querySelector('.card-top');
      const variantsTextDiv = slide.querySelector('.variant-desc');

      anchorElement.appendChild(variantsImageDiv);
      anchorElement.appendChild(variantsTextDiv);
      slide.appendChild(anchorElement);
    });
  } else {
    previousButton.classList.add('feature-prev');
    nextButton.classList.add('feature-next');
  }

  block.parentElement.appendChild(previousButton);
  block.parentElement.appendChild(nextButton);

  const slides = document.querySelectorAll('.swiper-slide');
  const nextSlide = document.querySelector('.swiper-button-next.variants-next');
  const prevSlide = document.querySelector('.swiper-button-prev.variants-prev');
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

  function updateSlides() {
    slides.forEach((slide, indx) => {
      const position = indx - curSlide;
      if (position >= 0 && position < slidesPerScroll) {
        slide.classList.remove('hidden-slide');
      } else {
        slide.classList.add('hidden-slide');
      }
    });
  }
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
