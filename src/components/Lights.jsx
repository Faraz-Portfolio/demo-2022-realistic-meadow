import React from "react";

export default function Lights() {
  const pos = [3, 2, 3];

  return (
    <>
      {/* <Sky sunPosition={pos} distance={100} mieDirectionalG={1} /> */}
      <hemisphereLight
        args={[0xffffff, 0xffffff, 1.0]}
        color={"#e0f7fe"}
        position={[0, 50, 0]}
        groundColor={0xcbc1b2}
        intensity={1}
      />
      <directionalLight
        position={pos}
        color="#f8ecde"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-22}
        shadow-camera-bottom={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        intensity={2}
      />
    </>
  );
}
