import { Box, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import mergeRefs from "react-merge-refs";
import { MathUtils, Vector2 } from "three";
import { FBM } from "three-noise";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

const vec = new Vector2();
export function Hero(props) {
  return (
    <group {...props}>
      <Box args={[1, 3, 2]} position={[0, 1.5, 0]}>
        <meshPhysicalMaterial />
      </Box>
    </group>
  );
}

export function Enemy(props) {
  return (
    <group {...props}>
      <Box args={[1, 3, 2]} position={[0, 1.5, 0]}>
        <meshPhysicalMaterial />
      </Box>
    </group>
  );
}

const Bee = forwardRef((props, ref) => {
  const { scene, animations } = useGLTF(
    "/demo-2022-realistic-meadow/models/Bee.glb"
  );
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, cloned);

  useEffect(() => {
    cloned.traverse((o) => {
      o.castShadow = o.receiveShadow = true;

      if (o.material) {
        o.material.envMapIntensity = 0.2;
      }
    });
  }, [cloned]);

  const fbm = useMemo(() => new FBM({ seed: Math.random() }), []);
  const offset = useMemo(() => Math.random() * 100, []);
  const group = useRef();
  const release = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      if (actions?.["_bee_hover"]) {
        release.current = true;
        actions["_bee_hover"].timeScale = 10;
        actions["_bee_hover"].play();
      }
    }, MathUtils.randInt(0, 20000));

    return () => {
      actions?.["_bee_hover"]?.stop().reset();
    };
  }, [actions]);

  useFrame(({ clock }, dt) => {
    if (release.current) {
      vec.set(clock.elapsedTime, clock.elapsedTime);

      group.current.position.y += fbm.get2(vec) * 0.1;
      if (group.current.position.y < 2) group.current.position.y = 2;
      group.current.position.z += 0.1;

      if (group.current.position.z > 20) {
        group.current.position.z = MathUtils.randFloat(-20, -40);
        group.current.position.x = MathUtils.randFloat(-5, -5);
      }
    } else {
      group.current.position.z = 100;
    }
  });

  return (
    <group ref={mergeRefs([group, ref])}>
      <primitive scale={0.02} {...props} object={cloned} />
    </group>
  );
});

export function Bees(props) {
  const refs = useRef([]);

  useEffect(() => {
    refs.current.forEach((bee) => {
      bee.position.set(
        MathUtils.randFloat(-5, 5), //
        MathUtils.randFloat(-5, 5),
        MathUtils.randFloat(-5, 5)
      );
    });
  }, []);

  return (
    <group {...props}>
      {Array.from({ length: 2 }, (_, i) => (
        <Bee
          key={`bee${i}`}
          position={[2, 0, 2]}
          ref={(r) => void (r && refs.current.push(r))}
        />
      ))}
    </group>
  );
}
