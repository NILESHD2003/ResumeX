import React, { useRef, useState } from 'react';
// Import Swiper React components. Using swiper js.
import { Swiper, SwiperSlide } from 'swiper/react';

// import Swiper core and required modules
import { Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';





const CreateTemplate = ({ slides }) => {
  return (
    <section className="p-8 my-8">
      
        {/* Headiong and p section */}
        <h2 className="text-4xl font-medium mt-10 text-center" id="templates">
          Beautiful Resume Templates
        </h2>

        <p className="text-[#9D9D9D] mt-6  text-center mb-8 font-semibold">
          Choose from out collection of professionally designed templates that
          stand out.
        </p>
        {/* Implementing Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Scrollbar, A11y]}
          spaceBetween={20}
          slidesPerView={4}
          // navigation
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          // pagination={{ clickable: true }}
          // scrollbar={{ draggable: true }}
          className="mySwiper"
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {/* Mapping carousel */}
          {slides.map((slide) => (
            <SwiperSlide key={slide.link}>
              <img
                src={slide.link}
                alt={slide.title}
                className="w-full h-auto object-contain rounded-lg border shadow"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      
    </section>
  );
};

export default CreateTemplate;
