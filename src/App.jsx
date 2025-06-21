import {
  Environment,
  Loader,
  OrbitControls,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bloom,
  BrightnessContrast,
  DepthOfField,
  EffectComposer,
  HueSaturation,
  Vignette,
} from "@react-three/postprocessing";
import { button, Leva, useControls } from "leva";
import { Suspense } from "react";
import { Color, MathUtils, Vector3 } from "three";
import Lights from "./components/Lights";
import "./index.css";
import { Grass, Model } from "./models/Boulders";
import { Bees } from "./models/Characters";
import Tag from "./Tag";

const URLs = {
  boulder1:
    "/demo-2022-photorealistic-meadow/models/Tundra Boulder_viztbccdw/Tundra Boulder_LOD1__viztbccdw.glb",
  boulder4:
    "/demo-2022-photorealistic-meadow/models/Tundra Rocky Ground_vjdraaqmw/Tundra Rocky Ground_LOD1__vjdraaqmw.glb",
  ground4:
    "/demo-2022-photorealistic-meadow/models/Tundra Rocky Ground_vjdragpmw/Tundra Rocky Ground_LOD1__vjdragpmw.glb",
  ground5:
    "/demo-2022-photorealistic-meadow/models/Tundra Rocky Ground_vjbodahmw/Tundra Rocky Ground_LOD1__vjbodahmw.glb",
  grass1:
    "/demo-2022-photorealistic-meadow/models/Wild Grass_vlkhcbxia/Wild Grass_LOD1_Var1_vlkhcbxia.glb",
  grass3:
    "/demo-2022-photorealistic-meadow/models/Thatching Grass_uddmcgbia/Thatching Grass_LOD1_Var1_uddmcgbia.glb",
  grass4:
    "/demo-2022-photorealistic-meadow/models/White Everlasting_ucvobbbia/White Everlasting_LOD1_Var1_ucvobbbia.glb",
  rockCluster:
    "/demo-2022-photorealistic-meadow/models/Mossy Rock Cluster_regsH/Mossy Rock Cluster_LOD1__regsH.glb",
};

function Capture() {
  const gl = useThree((state) => state.gl);
  useControls({
    Screenshot: button(() => {
      const link = document.createElement("a");
      link.setAttribute("download", "canvas.png");
      link.setAttribute(
        "href",
        gl.domElement
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream")
      );
      link.click();
    }),
  });

  return null;
}

function Thing() {
  return (
    <>
      <group>
        <Model url={URLs.ground4} />
        <Model url={URLs.ground5} position={[0, -0.2, 0]} />
        <Model
          url={URLs.ground5}
          position={[0, 0, -20]}
          rotation={[0, MathUtils.degToRad(180), 0]}
        />
        <Model
          url={URLs.ground5}
          position={[0, 0, 20]}
          rotation={[0, MathUtils.degToRad(180), 0]}
        />

        <group position={[35, 0, 0]}>
          <Model url={URLs.ground5} />
          <Model
            url={URLs.ground5}
            position={[0, 0, -20]}
            rotation={[0, MathUtils.degToRad(180), 0]}
          />
          <Model
            url={URLs.ground5}
            position={[0, 0, 20]}
            rotation={[0, MathUtils.degToRad(180), 0]}
          />
        </group>

        <group position={[35 / 2, 0, 0]}>
          {/* <axesHelper args={[10]} material-depthTest={false} /> */}

          <Grass
            url={URLs.grass3}
            radius={3}
            variation={1}
            scale={10}
            count={10000}
          />
          <Grass
            url={URLs.grass1}
            radius={3}
            variation={4}
            scale={13}
            count={10000}
          />
          <Grass
            url={URLs.grass1}
            radius={3}
            variation={3}
            scale={13}
            count={10000}
          />

          <Grass
            url={URLs.grass4}
            radius={3}
            variation={1}
            scale={15}
            count={100}
            noCol
          />
          <Grass
            url={URLs.grass4}
            radius={3}
            variation={2}
            scale={15}
            count={50}
            noCol
          />
          <Grass
            url={URLs.grass4}
            radius={3}
            variation={12}
            scale={15}
            count={50}
            noCol
          />
          <Grass
            url={URLs.grass3}
            radius={3}
            variation={2}
            scale={15}
            count={200}
            noCol
          />

          <Model url={URLs.boulder1} scale={10} position={[0, 0, 0]} />
          <Model url={URLs.rockCluster} scale={10} position={[10, 0, -15]} />
          <Model url={URLs.boulder4} scale={10} position={[-4, 0, 45]} />

          <Sparkles
            scale={[50, 10, 50]}
            size={6}
            count={200}
            speed={2}
            noise={10}
            color={"yellow"}
            position={[0, 2, 0]}
          />
          <Bees position={[0, 2, 0]} />
        </group>
      </group>
    </>
  );
}

function Post() {
  const { DOF } = useControls({
    DOF: {
      value: false,
    },
  });

  return (
    <EffectComposer>
      <Vignette eskil={false} offset={0.1} darkness={0.6} />
      <BrightnessContrast contrast={0.001} />
      <HueSaturation saturation={0.4} />
      <Bloom intensity={0.2} luminanceThreshold={0} />

      {DOF && (
        <DepthOfField
          worldFocusDistance={new Vector3(25, 15, 25).distanceTo(
            new Vector3(35 / 2, 0, 0)
          )}
          focalLength={0.009}
          bokehScale={3}
        />
      )}
    </EffectComposer>
  );
}

export default function App() {
  return (
    <>
      <Canvas
        dpr={devicePixelRatio}
        shadows
        gl={{
          // toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
          preserveDrawingBuffer: true,
        }}
      >
        <Capture />
        <fog
          attach="fog"
          args={[new Color("#cee4ed").convertLinearToSRGB(), 30, 50]}
        />
        <color
          attach="background"
          args={[new Color("#cee4ed").convertLinearToSRGB()]}
        />

        <OrbitControls
          target={[35 / 2, 0, 0]}
          autoRotate
          autoRotateSpeed={2}
          makeDefault
          enablePan={false}
        />
        <PerspectiveCamera fov={40} position={[25, 15, 25]} makeDefault />

        <Suspense>
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloppenheim_04_1k.hdr" />
          <Thing />
        </Suspense>

        <Lights />
        <Post />

        {/* <Stats /> */}
      </Canvas>
      <Loader />
      <Leva collapsed titleBar={{ title: "Controls" }} />
      <Tag />
    </>
  );
}
