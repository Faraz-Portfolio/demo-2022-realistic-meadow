import { Circle, Sampler, useGLTF, useTexture } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import Perlin from "perlin.js";
import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, MathUtils, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import WindLayer from "./WindLayer";

import { extend, useFrame } from "@react-three/fiber";

extend({ WindLayer });

const center = new Vector3(35 / 2, 0, 0);
export function Model({ url, ...props }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  useEffect(() => {
    cloned.traverse((o) => {
      o.castShadow = o.receiveShadow = true;

      if (o.material) {
        o.material.envMapIntensity = 1;
        // o.material.roughness *= 0.75
      }
    });
  }, [cloned]);

  return <primitive scale={5} {...props} object={cloned} />;
}
Perlin.seed(Math.random());

export function Grass({
  url,
  count = 1000,
  variation = 1,
  position,
  radius = 2,
  noCol,
  ...props
}) {
  const { nodes, materials } = useGLTF(url);

  const _url = url.replace("Var1", `Var${variation}`);
  const split = _url.split("_");
  const id = split[split.length - 1].replace(".glb", "");

  const opacity = useTexture(
    `${_url.substring(
      0,
      _url.lastIndexOf("/")
    )}/textures/Opacity_4K__${id}.jpg`,
    (t) => {
      t.flipY = false;
    }
  );

  const windLayer = useRef(null);
  useFrame(() => windLayer.current?.time && (windLayer.current.time += 0.005));
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <Sampler
        count={count}
        transform={({ position, normal, dummy: object }) => {
          const p = position.clone().multiplyScalar(2);
          const n = Math.pow(Perlin.simplex3(...p.toArray()), 0.01);
          object.scale.setScalar(
            MathUtils.mapLinear(n, -1, 1, 0.2, 0.4) *
              MathUtils.randFloat(1, 1.3)
          );
          object.position.copy(position);
          object.position.z += 0.03;
          object.updateMatrix();

          while (
            object.position.x > -0.7 &&
            object.position.x < 0.7 &&
            object.position.y > -0.7 &&
            object.position.y < 0.7
          ) {
            object.position.x = MathUtils.randFloat(-1, 1);
            object.position.y = MathUtils.randFloat(-1, 1);
          }

          object.lookAt(normal.add(position));
          object.rotation.y += (MathUtils.randFloat(-1, 1) * Math.PI) / 4;
          object.rotation.z += (MathUtils.randFloat(-1, 1) * Math.PI) / 4;
          object.rotation.x +=
            (MathUtils.randFloat(-1, 1) * Math.PI) / 4 + Math.PI / 2;
          object.updateMatrix();

          return object;
        }}
      >
        <Circle args={[radius]}>
          <meshBasicMaterial />
        </Circle>
        <instancedMesh
          args={[null, null, count]}
          geometry={
            nodes[Object.keys(nodes).find((s) => s.includes("_LOD"))].geometry
          }
          scale={10}
          {...props}
        >
          {!noCol ? (
            <LayerMaterial
              side={DoubleSide}
              lighting="physical"
              envMapIntensity={0}
              {...materials[Object.keys(materials)[0]]}
              vertexColors={false}
              alphaMap={opacity}
              transparent
              castShadow
              receiveShadow
            >
              <Gradient
                colorA="#596700"
                colorB="#977b00"
                start={0.5}
                end={2}
                contrast={2}
                axes="y"
              />
              <Gradient
                mode="multiply"
                alpha={0.21}
                colorA="#5f6e00"
                colorB="#010000"
                start={0}
                end={1}
                contrast={3}
                axes="y"
              />
              <windLayer
                args={[{ mode: "multiply" }]}
                colorA={"#fff0f0"}
                colorB={"#b9d5c5"}
                noiseScale={5}
                noiseStrength={7}
                length={1.4}
                sway={4}
                ref={windLayer}
              />
            </LayerMaterial>
          ) : (
            <meshStandardMaterial
              {...materials[Object.keys(materials)[0]]}
              vertexColors={false}
              alphaMap={opacity}
              transparent
              castShadow
              side={DoubleSide}
              receiveShadow
            />
          )}
        </instancedMesh>
      </Sampler>
    </group>
  );
}
