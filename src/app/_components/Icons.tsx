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
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    ...rest,
  };
}

export function IconHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)} aria-hidden="true">
      <path d="M1.5 16.5h8s1 0 1 1v5s0 1 -1 1h-8s-1 0 -1 -1v-5s0 -1 1 -1" />
      <path d="m22.5 23.5 -8 0s-1 0 -1 -1l0 -11s0 -1 1 -1l8 0s1 0 1 1l0 11s0 1 -1 1" />
      <path d="m22.5 7.5 -8 0s-1 0 -1 -1l0 -5s0 -1 1 -1l8 0s1 0 1 1l0 5s0 1 -1 1" />
      <path d="M1.5 0.5h8s1 0 1 1v11s0 1 -1 1h-8s-1 0 -1 -1v-11s0 -1 1 -1" />
    </svg>
  );
}

export function IconHistory(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)} aria-hidden="true">
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 5.5v4h4" />
      <path d="M12 8.5v4.2l2.8 1.8" />
    </svg>
  );
}

export function IconDumbbell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)} aria-hidden="true">
      <path d="M12 3.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0 -5 0" />
      <path d="M14.841 14.593a5 5 0 1 0 6.483 -0.72" />
      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 5v4A1.5 1.5 0 0 0 5 10.5h1.726a1 1 0 0 0 0.553 -0.167l3.861 -2.562a1.5 1.5 0 0 1 1.82 0.076l2.166 1.8a1.5 1.5 0 0 0 0.96 0.348H19a1.5 1.5 0 0 1 0 3h-2.914a4.5 4.5 0 0 1 -2.88 -1.043l-1.285 -1.07 -2.465 1.6a1 1 0 0 0 -0.456 0.842V21.5a1.5 1.5 0 0 1 -3 0v-8H5A4.505 4.505 0 0 1 0.5 9V5A1.5 1.5 0 0 1 2 3.5" />
    </svg>
  );
}

export function IconForkKnife(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)} aria-hidden="true">
      <path d="M20.491 14.1a0.5 0.5 0 0 0 -0.491 -0.6H1a0.5 0.5 0 0 0 -0.491 0.6 9.13 9.13 0 0 0 5.9 6.87 0.5 0.5 0 0 1 0.291 0.67A3.43 3.43 0 0 0 6.415 23a0.5 0.5 0 0 0 0.5 0.5h7.17a0.5 0.5 0 0 0 0.5 -0.5 3.43 3.43 0 0 0 -0.284 -1.365 0.5 0.5 0 0 1 0 -0.4 0.506 0.506 0 0 1 0.291 -0.272 9.13 9.13 0 0 0 5.899 -6.863" />
      <path d="M23.41 4.729a1 1 0 0 1 -0.5 1.324l-5.69 2.584a0.749 0.749 0 0 1 -0.993 -0.372l-1.861 -4.1a0.749 0.749 0 0 1 0.372 -0.993L20.432 0.59a1 1 0 0 1 1.324 0.5Z" />
      <path d="m10.179 6.874 1.262 -0.812" />
      <path d="m12.179 10.874 0.762 -0.812" />
      <path d="m9.941 9.562 1.067 -0.927" />
    </svg>
  );
}
