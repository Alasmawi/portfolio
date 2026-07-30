import { useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './CoverflowGallery.css';

// Slow, ambient rotation — a display case turning, not a carousel stepping through slides.
const AMBIENT_SPEED = 5000;
const AMBIENT_EASE = 'linear';

// Clicking a slide blends into a longer, eased "flow" toward it instead of snapping.
const CLICK_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
const CLICK_STEP_MS = 3200;
const CLICK_SPEED_MIN = 1400;
const CLICK_SPEED_MAX = 6500;

function loopStepDistance(from, to, total) {
  const diff = Math.abs(to - from) % total;
  return Math.min(diff, total - diff);
}

function setSlidesEasing(swiper, easing) {
  if (!swiper?.wrapperEl) return;
  swiper.wrapperEl.style.transitionTimingFunction = easing;
  swiper.slides.forEach((slideEl) => {
    slideEl.style.transitionTimingFunction = easing;
  });
}

export default function CoverflowGallery({ items = [] }) {
  const swiperRef = useRef(null);

  const handleSwiperClick = useCallback(
    (swiper) => {
      const slideEl = swiper.clickedSlide;
      if (!slideEl) return;
      const targetIndex = Number(slideEl.getAttribute('data-swiper-slide-index'));
      if (Number.isNaN(targetIndex) || targetIndex === swiper.realIndex) return;

      const distance = loopStepDistance(swiper.realIndex, targetIndex, items.length);
      const speed = Math.min(
        CLICK_SPEED_MAX,
        Math.max(CLICK_SPEED_MIN, distance * CLICK_STEP_MS)
      );

      setSlidesEasing(swiper, CLICK_EASE);
      swiper.slideToLoop(targetIndex, speed);
    },
    [items.length]
  );

  if (items.length === 0) return null;

  return (
    <div className="k9-coverflow relative">
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={AMBIENT_SPEED}
        slideToClickedSlide={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setSlidesEasing(swiper, AMBIENT_EASE);
          // loop + slidesPerView="auto" can land the initial centered slide
          // one off from real index 0 — force it explicitly, no animation.
          swiper.slideToLoop(0, 0, false);
        }}
        onClick={handleSwiperClick}
        onTransitionEnd={(swiper) => setSlidesEasing(swiper, AMBIENT_EASE)}
        className="!py-10 sm:!py-14"
      >
        {items.map((item, i) => (
          <SwiperSlide
            key={`${item.type}-${item.tag ?? i}`}
            data-slide-type={item.type}
            className="!h-[146px] !w-[260px] sm:!h-[214px] sm:!w-[380px] md:!h-[259px] md:!w-[460px]"
          >
            <div className="card-inner relative flex h-full w-full items-center justify-center overflow-hidden border border-base-border bg-base-surface p-2 sm:p-3">
              <img
                src={item.src}
                alt={item.alt ?? ''}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover"
              />
              {item.tag && (
                <span className="absolute bottom-3 left-3 rounded border border-base-border/80 bg-base-bg/80 px-2 py-1 font-mono text-[10px] text-text-dim backdrop-blur-sm">
                  {item.tag}
                </span>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
