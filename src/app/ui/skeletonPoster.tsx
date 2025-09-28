import React from "react";

type Props = {
  count?: number;
  width?: string;
  height?: string;
};

export default function SkeletonCard({ count = 10, width, height}: Props) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`${width} ${height} rounded-xl bg-white/10 animate-pulse`}
        />
      ))}
    </>
  );
}
