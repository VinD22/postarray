/**
 * The share card X uses.
 *
 * Identical to the Open Graph card by design. Two differently cropped brand
 * cards would be two assets to keep in sync for no reader benefit, so this
 * file re-exports the same renderer and the same dimensions.
 */
export { default, alt, contentType, size } from './opengraph-image';
