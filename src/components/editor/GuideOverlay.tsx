"use client";

import React from "react";

interface GuideOverlayProps {
  topSpacePt: number;
}

export default function GuideOverlay({ topSpacePt }: GuideOverlayProps) {
  return (
    <div className="gd">
      <i style={{ left: 0, right: 0, top: `${topSpacePt}pt`, height: "1px" }} />
      <i style={{ top: 0, bottom: 0, left: "45pt", width: "1px" }} />
      <i style={{ top: 0, bottom: 0, right: "45pt", width: "1px" }} />
      <i style={{ left: 0, right: 0, bottom: "22.5pt", height: "1px" }} />
    </div>
  );
}
