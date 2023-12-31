import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function CarouselCompliance({ slides }) {
  return (
    <div className=" px-9 py-4 m-auto">
      {/* <div className="heading">Certificates</div> */}
      <Swiper grabCursor={true} className="w-full h-full relative">
        {slides.map((slide, index) => (
          <SwiperSlide
            key={`img => ${index}`}
            className="absolute w-full h-full"
          >
            <div className="flex justify-center">
              <div className="place-self-center h-full">
                <img
                  src={slide.documentURL}
                  alt="img"
                  className="object-contain"
                />
              </div>
              <div className=" w-full px-5 py-10 text-3xl font-bold">
                {slide.documentTitle}
                <br />
                <br />
                <p className="text-lg font-normal pl-5 text-justify">
                  {slide.documentDescription}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
