export default function decorate(block) {
  block.classList.add("swiper-wrapper");
  [...block.children].forEach((row, i) => {
    row.classList.add("swiper-slide");
    const classes = ["image", "text"];

    classes.forEach((e, j) => {
      row.children[j].classList.add(`carousel-${e}`);
    });
  });

  const previousButton = document.createElement("div");
  const nextButton = document.createElement("div");
  previousButton.classList.add("swiper-button-prev");
  nextButton.classList.add("swiper-button-next");

  if (block.classList.contains("carousel")) {
    previousButton.classList.add("carousel-prev");
    nextButton.classList.add("carousel-next");

    const swiperSlides = block.querySelectorAll('.swiper-slide');

    swiperSlides.forEach((slide) => {
      const anchorElement = document.createElement('a');
      slide.appendChild(anchorElement);

      const carouselImageDiv = slide.querySelector('.carousel-image');
      const carouselTextDiv = slide.querySelector('.carousel-text');

      const anchorlinkDiv = carouselTextDiv.querySelector('a');
      anchorElement.href = anchorlinkDiv.getAttribute("href");

      anchorElement.appendChild(carouselImageDiv);
      anchorElement.appendChild(carouselTextDiv);
      slide.appendChild(anchorElement);
    });
  }else{
    previousButton.classList.add("feature-prev");
    nextButton.classList.add("feature-next");
  }

  block.parentElement.appendChild(previousButton);
  block.parentElement.appendChild(nextButton);

  const swiper = new Swiper(".feature .carousel-wrapper", {
    navigation: {
      nextEl: ".swiper-button-next.feature-next",
      prevEl: ".swiper-button-prev.feature-prev",
    },
    watchSlidesProgress: true,
    spaceBetween: "27px",
    breakpoints: {
      390: {
        slidesPerView: 1,
      },
      1023:{
        slidesPerView: 3,
      }
    },
  });
  new Swiper(".carousel .carousel-wrapper", {
    slidesPerView: 1.4,
    spaceBetween: "16px",
    navigation: {
      nextEl: ".swiper-button-next.carousel-next",
      prevEl: ".swiper-button-prev.carousel-prev",
    },
    watchSlidesProgress: true,
    breakpoints: {
      1023:{
        slidesPerView: 3,
        spaceBetween: "0px"
      }
    },
  });
}