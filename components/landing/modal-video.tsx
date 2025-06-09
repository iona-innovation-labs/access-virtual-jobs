"use client";

import { useState, useRef } from "react";
import type { StaticImageData } from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface ModalVideoProps {
  thumb: StaticImageData;
  thumbWidth: number;
  thumbHeight: number;
  thumbAlt: string;
  video: string;
  videoWidth: number;
  videoHeight: number;
}

export default function ModalVideo({
  thumb,
  thumbWidth,
  thumbHeight,
  thumbAlt,
  video,
  videoWidth,
  videoHeight,
}: ModalVideoProps) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative inline-flex cursor-pointer items-center justify-center">
          <Image
            src={thumb}
            width={thumbWidth}
            height={thumbHeight}
            alt={thumbAlt}
          />
          <button
            className="absolute z-10 inline-flex h-10 items-center rounded bg-white px-4 text-sm font-medium text-gray-900 shadow hover:bg-blue-50"
            aria-label="Watch the video"
          >
            <span className="mr-2 text-blue-500">
              <svg
                className="fill-current"
                width="9"
                height="12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.783.088A.5.5 0 0 0 0 .5v11a.5.5 0 0 0 .783.412l8-5.5a.5.5 0 0 0 0-.824l-8-5.5Z" />
              </svg>
            </span>
            Quick Explainer
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl bg-black p-0 aspect-video">
        <DialogTitle className="sr-only">Video Explainer</DialogTitle>
        <video
          ref={videoRef}
          width={videoWidth}
          height={videoHeight}
          loop
          controls
          autoPlay
          className="w-full h-full object-contain"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </DialogContent>
    </Dialog>
  );
}
