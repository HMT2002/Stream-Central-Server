import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import SwiperItems from '../swiper-items/swiper-item';

const SwiperEspisode = () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      className=" mx-5 px-3 py-6"
    >
      <SwiperSlide className=" max-w-fit">
        <SwiperItems />
      </SwiperSlide>
      <SwiperSlide className=" max-w-fit">
        <SwiperItems />
      </SwiperSlide>
      <SwiperSlide className=" max-w-fit">
        <SwiperItems />
      </SwiperSlide>
      <SwiperSlide className=" max-w-fit">
        <SwiperItems />
      </SwiperSlide>
      <SwiperSlide className=" max-w-fit">
        <SwiperItems />
      </SwiperSlide>
      <SwiperSlide className=" max-w-fit">
        <SwiperItems />
      </SwiperSlide>
      <SwiperSlide className=" max-w-fit">
        <SwiperItems />
      </SwiperSlide>
    </Swiper>
  );
};

export default SwiperEspisode;
