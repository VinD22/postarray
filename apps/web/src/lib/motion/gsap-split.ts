'use client';

/**
 * GSAP with SplitText (and ScrollTrigger) registered, for the kinetic
 * marketing headlines and nothing else.
 */
import { SplitText } from 'gsap/SplitText';

import { gsap, ScrollTrigger, useGSAP } from './gsap-scroll';

gsap.registerPlugin(SplitText);

export { gsap, useGSAP, ScrollTrigger, SplitText };
