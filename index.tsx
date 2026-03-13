import { Composition } from "remotion";
import { AITutorReel } from "./AITutorReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AITutorReel"
        component={AITutorReel}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
