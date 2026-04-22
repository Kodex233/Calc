"use client";

import * as React from "react";

function baseProps(props: React.SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props;
  return {
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...rest,
  };
}

export function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)} aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

export function IconHistory(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)} aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

export function IconStats(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)} aria-hidden="true">
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V11" />
    </svg>
  );
}

