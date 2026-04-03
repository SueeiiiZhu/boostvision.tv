import Image, { ImageProps } from 'next/image';

/**
 * OptimizedImage - Automatically optimizes Strapi CDN images by requesting
 * appropriate format sizes (thumbnail/small/medium) instead of full originals.
 *
 * For non-Strapi (local) images, behaves identically to next/image.
 */
export default function OptimizedImage({ src, ...props }: ImageProps) {
  let optimizedSrc = src;

  if (typeof src === 'string' && src.includes('strapiapp.com')) {
    let format = 'medium';

    if (props.priority) {
      format = 'small';
    } else if (props.width && Number(props.width) <= 160) {
      format = 'thumbnail';
    } else if (props.width && Number(props.width) <= 640) {
      format = 'small';
    }

    const separator = src.includes('?') ? '&' : '?';
    optimizedSrc = `${src}${separator}format=${format}`;
  }

  return <Image src={optimizedSrc} {...props} />;
}
