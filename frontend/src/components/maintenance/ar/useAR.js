import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import toast from "react-hot-toast";
import { setupPolygon } from "./polygonUtils";

const RETICLE_COLORS = {
  editing: 0x00ff88,
  hovering: 0xffaa00,
  placing: 0xffffff,
  scanning: 0x888888,
};

export function useAR(
  mountRef,
  overlayRef,
  initialData,
  onSaveCallback,
  markerUrl,
) {
  const [arSessionActive, setArSessionActive] = useState(false);
  const [isMarkerTracked, setIsMarkerTracked] = useState(false);
  const [isAnchorLocked, setIsAnchorLocked] = useState(false);
  const [currentMode, setCurrentMode] = useState("scanning");
  const [isArSupported, setIsARSupported] = useState(null);

  // Grouped Mutable Refs
  const stateRefs = useRef({
    isTracked: false,
    isAnchorLocked: false,
    ignoreTap: false,
  });

  // Grouped ThreeJS Refs
  const threeRefs = useRef({
    renderer: null,
    api: null,
    anchorGroup: null,
    trackerVisual: null,
    reticle: null,
    arButton: null,
  });

  useEffect(() => {
    (async () => {
      if (navigator.xr)
        setIsARSupported(await navigator.xr.isSessionSupported("immersive-ar"));
      else setIsARSupported(false);
    })();
  }, []);

  useEffect(() => {
    if (!mountRef.current || !overlayRef.current || !markerUrl) return;

    let hitTestSource = null;
    let hitTestSourceRequested = false;

    async function initAR() {
      try {
        // process the marker
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = markerUrl;
        await img.decode();
        const markerBitmap = await createImageBitmap(img);

        // Setup the actual three scence
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          70,
          window.innerWidth / window.innerHeight,
          0.01,
          50,
        );

        // Setup the render context and the xr
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.xr.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);
        threeRefs.current.renderer = renderer;

        // Setup the actual enter ar button and hide it
        const arButton = ARButton.createButton(renderer, {
          requiredFeatures: ["hit-test"],
          optionalFeatures: ["dom-overlay", "image-tracking"],
          domOverlay: { root: overlayRef.current },
          trackedImages: [{ image: markerBitmap, widthInMeters: 0.12 }],
        });
        Object.assign(arButton.style, {
          opacity: "0",
          position: "absolute",
          pointerEvents: "none",
        }); // Hide the button
        mountRef.current.appendChild(arButton);
        threeRefs.current.arButton = arButton;

        // Setup the anchor group that will be moved by the tracked image and will contain all our content. This makes it easy to keep the content in place relative to the marker as well as applying any global transforms if needed.
        const anchorGroup = new THREE.Group();
        anchorGroup.matrixAutoUpdate = false;

        const guideMat = new THREE.LineBasicMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.8,
          linewidth: 2,
        });
        const guideGroup = new THREE.Group();
        guideGroup.rotation.x = -Math.PI / 2;

        guideGroup.add(
          new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(0.1, 0.1, 0.001)),
            guideMat,
          ),
        );
        guideGroup.add(
          new THREE.LineSegments(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(-0.015, 0, 0),
              new THREE.Vector3(0.015, 0, 0),
              new THREE.Vector3(0, -0.015, 0),
              new THREE.Vector3(0, 0.015, 0),
            ]),
            guideMat,
          ),
        );

        anchorGroup.add(guideGroup);
        scene.add(anchorGroup);

        threeRefs.current.anchorGroup = anchorGroup;
        threeRefs.current.trackerVisual = guideMat;
        threeRefs.current.api = setupPolygon(anchorGroup);

        // Setup the reticles for hit tests.
        const reticle = new THREE.Mesh(
          new THREE.RingGeometry(0.02, 0.01, 32).rotateX(-Math.PI / 2),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
          }),
        );
        reticle.visible = false;
        scene.add(reticle);
        threeRefs.current.reticle = reticle;

        // Setup the session listnerenrs
        renderer.xr.addEventListener("sessionstart", () =>
          setArSessionActive(true),
        );
        renderer.xr.addEventListener("sessionend", () => {
          setArSessionActive(false);
          setIsMarkerTracked(false);
          setIsAnchorLocked(false);
          stateRefs.current.isTracked = false;
          stateRefs.current.isAnchorLocked = false;
          hitTestSourceRequested = false;
          hitTestSource = null;
        });

        // End of setup above.

        // Start the render loop
        renderer.setAnimationLoop((_, frame) => {
          if (!frame) return;
          const session = renderer.xr.getSession();
          const referenceSpace = renderer.xr.getReferenceSpace();

          // Image Tracking Logic
          if (frame.getImageTrackingResults) {
            const results = frame.getImageTrackingResults();
            if (
              results.length > 0 &&
              results[0].trackingState === "tracked" &&
              !stateRefs.current.isAnchorLocked
            ) {
              const pose = frame.getPose(results[0].imageSpace, referenceSpace);
              if (pose) {
                anchorGroup.matrix.fromArray(pose.transform.matrix);
                anchorGroup.updateMatrixWorld(true);
                if (!stateRefs.current.isTracked) {
                  setIsMarkerTracked(true);
                  stateRefs.current.isTracked = true;
                  threeRefs.current.trackerVisual.color.setHex(0x00ff88);
                }
              }
            }
          }

          // Hit Test Logic
          if (!hitTestSourceRequested) {
            session.requestReferenceSpace("viewer").then((viewerSpace) => {
              session
                .requestHitTestSource({ space: viewerSpace })
                .then((src) => (hitTestSource = src));
            });
            session.addEventListener("select", () => {
              if (stateRefs.current.ignoreTap || !reticle.visible) return;
              if (!stateRefs.current.isAnchorLocked)
                return toast.error("Please Lock the Anchor first!");
              threeRefs.current.api.onTap(reticle.position);
            });
            hitTestSourceRequested = true;
          }

          if (hitTestSource) {
            const hitResults = frame.getHitTestResults(hitTestSource);
            if (hitResults.length > 0) {
              const pose = hitResults[0].getPose(referenceSpace);
              reticle.visible = true;
              reticle.position.copy(pose.transform.position);
              reticle.quaternion.copy(pose.transform.orientation);

              if (stateRefs.current.isAnchorLocked) {
                const mode = threeRefs.current.api.onReticleMove(
                  reticle.position,
                );
                reticle.material.color.setHex(RETICLE_COLORS[mode] ?? 0xffffff);
                setCurrentMode(mode);
              } else {
                reticle.material.color.setHex(RETICLE_COLORS.scanning);
                setCurrentMode(
                  stateRefs.current.isTracked ? "readyToLock" : "scanningQR",
                );
              }
            } else {
              reticle.visible = false;
              setCurrentMode("scanning");
            }
          }

          // alas render the scene
          renderer.render(scene, camera);
        });
      } catch (err) {
        console.error("AR Init Failed:", err);
      }
    }

    initAR();

    return () => {
      if (threeRefs.current.renderer) {
        threeRefs.current.renderer.setAnimationLoop(null);
        threeRefs.current.renderer.dispose();
        mountRef.current?.removeChild(threeRefs.current.renderer.domElement);
      }
    };
  }, [mountRef, overlayRef, markerUrl]);

  // Actions
  const toggleAnchorLock = () => {
    if (!stateRefs.current.isTracked)
      return toast.error("Wait for tracker to turn Green!");
    if (!stateRefs.current.isAnchorLocked) {
      if (!threeRefs.current.reticle.visible)
        return toast.error("Make sure the white ring is visible!");

      const imgPos = new THREE.Vector3();
      const imgQuat = new THREE.Quaternion();
      const imgScale = new THREE.Vector3();

      threeRefs.current.anchorGroup.matrix.decompose(imgPos, imgQuat, imgScale);
      threeRefs.current.anchorGroup.matrix.compose(
        threeRefs.current.reticle.position,
        imgQuat,
        imgScale,
      );
      threeRefs.current.anchorGroup.updateMatrixWorld(true);
    }

    const newState = !stateRefs.current.isAnchorLocked;
    stateRefs.current.isAnchorLocked = newState;
    setIsAnchorLocked(newState);
    if (threeRefs.current.trackerVisual) {
      threeRefs.current.trackerVisual.color.setHex(
        newState ? 0xff3333 : 0x00ff88,
      );
    }
  };

  const blockXRTap = () => (stateRefs.current.ignoreTap = true);
  const unblockXRTap = () =>
    setTimeout(() => (stateRefs.current.ignoreTap = false), 200); // To prevent double taps, we set a short timeout after each tap where taps are ignored.

  return {
    arSessionActive,
    isMarkerTracked,
    isAnchorLocked,
    currentMode,
    toggleAnchorLock,
    blockXRTap,
    unblockXRTap,
    isArSupported,
    startAR: () => threeRefs.current.arButton?.click(),
    endAR: () => threeRefs.current.renderer?.xr.getSession()?.end(),
    handleSave: () => {
      if (!stateRefs.current.isAnchorLocked)
        return toast.error("Lock the anchor first!");
      const coords = threeRefs.current.api.getVertices();
      if (coords.length < 3)
        return toast.error("Place at least 3 vertices first!");
      onSaveCallback(coords);
      return true;
    },
    handleLoad: () => {
      if (!stateRefs.current.isAnchorLocked)
        return toast.error("Lock the anchor first!");
      if (!initialData || initialData.length === 0)
        return toast.error("No existing data found.");
      threeRefs.current.api.loadVertices(initialData);
      toast.success("Polygon loaded!");
    },
    handleDeleteVertex: () => {
      threeRefs.current.api?.deleteSelectedVertex();
      blockXRTap();
      unblockXRTap();
    },
    handleClearAll: () => {
      threeRefs.current.api?.reset();
      toast("Canvas cleared");
    },
  };
}
