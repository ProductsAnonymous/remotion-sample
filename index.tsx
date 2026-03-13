import React from "react";
import { Composition } from "remotion";
import { AITutorReel } from "./AITutorReel";

// TransitionSeries frame math:
// Sequences: 150 + 210 + 180 + 210 + 120 + 120 = 990
// Transitions overlap: 15 + 15 + 12 + 15 + 18 = 75
// Effective total: 990 - 75 = 915 frames (~30.5s at 30fps)

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AITutorReel"
        component={AITutorReel}
        durationInFrames={915}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
