import Image from 'next/image';
export function Photo({ name, alt, className = '', priority = false, sizes = '(max-width: 767px) 100vw, 50vw' }: { name: string; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  return <div className={`photo ${className}`}><Image src={`/images/shawtyslayz/${name}.webp`} alt={alt} fill sizes={sizes} preload={priority} quality={85} /></div>;
}
