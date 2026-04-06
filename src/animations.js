import { fly, scale } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export const fadeIn = (node, params) => {
  return fly(node, {
    y: 20,
    duration: 1200,
    delay: params.delay || 0,
    easing: quintOut
  });
};

export const scaleIn = (node, params) => {
  return scale(node, {
    duration: 1200,
    delay: params.delay || 0,
    easing: quintOut
  });
};

export const slideIn = (node, params) => {
  return fly(node, {
    x: params.direction === 'left' ? -20 : 20,
    duration: 1200,
    delay: params.delay || 0,
    easing: quintOut
  });
}; 