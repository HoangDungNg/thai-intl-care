import { cx } from "@/utils/cx";
import React, { useState, type ImgHTMLAttributes } from "react";

export interface ImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "placeholder"
> {
  src: string;
  alt: string;
  // DaisyUI mask options
  mask?:
    | "squircle"
    | "heart"
    | "hexagon"
    | "hexagon-2"
    | "decagon"
    | "pentagon"
    | "diamond"
    | "square"
    | "circle"
    | "parallelogram"
    | "parallelogram-2"
    | "parallelogram-3"
    | "parallelogram-4"
    | "star"
    | "star-2"
    | "triangle"
    | "triangle-2"
    | "triangle-3"
    | "triangle-4";
  // Loading states
  loading?: "lazy" | "eager";
  // Placeholder/fallback
  fallbackSrc?: string;
  placeholder?: string; // placeholder text or image
  // Size variants
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  // Aspect ratio
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
  // Effects
  rounded?: boolean | "sm" | "md" | "lg" | "full";
  shadow?: boolean | "sm" | "md" | "lg" | "xl";
  // Object fit
  bordered?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  // Loading skeleton
  showSkeleton?: boolean;
  // Error handling
  onError?: () => void;
  // Container class
  containerClassName?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  mask,
  loading = "lazy",
  fallbackSrc,
  placeholder,
  size = "md",
  aspectRatio,
  rounded = false,
  shadow = false,
  bordered = false,
  objectFit = "cover",
  showSkeleton = true,
  onError,
  containerClassName = "",
  className = "",
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Size classes
  const sizeClasses = {
    xs: "w-16 h-16",
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
    full: "w-full h-full",
  };

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  // Rounded classes
  const getRoundedClass = () => {
    if (!rounded) return "";
    if (rounded === true) return "rounded";
    return `rounded-${rounded}`;
  };

  // Shadow classes
  const getShadowClass = () => {
    if (!shadow) return "";
    if (shadow === true) return "shadow";
    return `shadow-${shadow}`;
  };

  // Object fit classes
  const objectFitClasses = {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  // Handle image load
  const handleLoad = () => {
    console.log("Image loaded");
    setIsLoading(false);
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else if (onError) {
      onError();
    }
  };

  const imageClasses = cx(
    sizeClasses[size],
    getRoundedClass(),
    getShadowClass(),
    objectFitClasses[objectFit],
    "transition-opacity duration-300",
    {
      [aspectRatioClasses[aspectRatio!]]: Boolean(aspectRatio),
      ["border border-base-300"]: bordered,
      [`mask mask-${mask}`]: Boolean(mask),
    },
    isLoading && showSkeleton ? "opacity-0" : "opacity-100",
    className,
  );

  const containerClasses = cx("relative inline-block", containerClassName);

  return (
    <div className={containerClasses}>
      {/* Loading skeleton */}
      {isLoading && showSkeleton && (
        <div
          className={cx(
            "absolute inset-0 animate-pulse bg-base-300",
            getRoundedClass(),
            { [`mask mask-${mask}`]: Boolean(mask) },
          )}
        />
      )}

      {/* Error state or placeholder */}
      {hasError && !fallbackSrc ? (
        <div
          className={cx(
            "flex items-center justify-center bg-base-200 text-base-content",
            imageClasses,
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={imageClasses}
          {...props}
        />
      )}

      {/* Optional placeholder text */}
      {placeholder && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-base-content/50">
          {placeholder}
        </div>
      )}
    </div>
  );
};
