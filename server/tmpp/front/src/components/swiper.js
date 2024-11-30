import React from 'react';

import { Splide, SplideSlide } from '@splidejs/react-splide';
import { isStringified } from '#c/functions/index';

export default (props) => {
  let theBreakpoints = {};
  if (props.breakpoints) {
    const json = isStringified(props.breakpoints);
    if (typeof json == 'object') theBreakpoints = json;
    else theBreakpoints = props.breakpoints;
  }
  let {
    children,
    className,
    type = 'loop',
    kind='slider',
    perPage = props.perPage || 4,
    pagination = props.pagination || false,
    arrows = props.arrows || false,
    autoplay = props.autoplay,
    lazyLoad = true,
    interval = 2000,
    pauseOnHover = true,
    pauseOnFocus = true,
    gap = '1rem',
    breakpoints = theBreakpoints || {
      1024: {
        perPage: 4,
      },
      768: {
        perPage: 3,
      },
      640: {
        perPage: 2,
      },
      320: {
        perPage: 1,
      },
    },
  } = props;

  if (autoplay == 'false') {
    autoplay = false;
  }
  // console.log(breakpoints)
  // return JSON.stringify(autoplay)
  let y = isStringified(breakpoints);
  if (typeof y == 'object') breakpoints = y;
  // else
  //   theBreakpoints = y
  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }
  // {JSON.stringify({breakpoints:breakpoints,perPage:perPage})}
  if(kind!='slider')
  if(breakpoints=="{}" || breakpoints=='undefined' || breakpoints==null ||  breakpoints=={} || isEmpty(breakpoints))
    breakpoints={
      1024: {
        perPage: 4,
      },
      768: {
        perPage: 3,
      },
      640: {
        perPage: 2,
      },
      320: {
        perPage: 2,
      },
    }
  // return JSON.stringify(breakpoints);

  return (
    <>
      <Splide
        options={{
          gap: gap,
          perPage: perPage,
          type: type,
          perMove: 1,
          pagination: pagination,
          direction: 'rtl',
          arrows: arrows,
          autoplay: autoplay,
          lazyLoad: lazyLoad,
          breakpoints: breakpoints,
          interval: interval,
        }}
        className={className}>
        {children &&
          children.length > 0 &&
          children.map((item, key) => {
            return <SplideSlide key={key}>{item}</SplideSlide>;
          })}
      </Splide>
    </>
  );
};
