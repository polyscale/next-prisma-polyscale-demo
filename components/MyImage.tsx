import Image from "next/image";
import { FC } from "react";
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f5f5f5" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f5f5f5" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f5f5f5" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const MyImage: FC<{ src: string; width: number; height: number }> = ({
  src,
  width,
  height,
}) => {
  return (
    <Image
      alt="cover"
      src={src}
      width={width}
      height={height}
      layout="responsive"
      placeholder="blur"
      objectFit="cover"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(
        shimmer(width, height)
      )}`}
      priority
    />
  );
};
