import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonials = [
  "Very smooth appointment booking.",
  "Doctors were friendly and professional.",
  "Best hospital experience so far.",
  "Easy to book and dashboard is helpful.",
];

export default function TestimonialsSlider() {
  return (
    <section className="mt-16 mb-20">
      <h2 className="text-3xl font-bold mb-6 text-white">Testimonials</h2>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop
        slidesPerView={1}
      >
        {testimonials.map((t, i) => (
          <SwiperSlide key={i}>
            <div className="glass p-8 rounded-3xl border border-white/10 text-center">
              <p className="text-lg italic text-white/80">"{t}"</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
