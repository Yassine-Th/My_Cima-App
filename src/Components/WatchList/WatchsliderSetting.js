export const watchlistSettings = {
  dots: true,
  infinite: false, // Set to false to prevent infinite scrolling
  speed: 500,
  slidesToShow: 4, // Adjust the number of slides to show
  slidesToScroll: 1, // Adjust the number of slides to scroll
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
