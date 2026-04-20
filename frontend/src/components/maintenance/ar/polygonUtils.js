import * as THREE from "three";

export function setupPolygon(anchorGroup) {
  const vertices = [];
  const markers = [];
  let lineLoop = null;
  let polygon = null;
  let selectedIndex = null;

  const SNAP_DIST = 0.06;

  const COLOR_DEFAULT = 0xffffff;
  const COLOR_HOVER = 0x00d2ff;
  const COLOR_EDITING = 0x00ff88;

  const lineMat = new THREE.LineDashedMaterial({
    color: 0xffffff,
    dashSize: 0.04,
    gapSize: 0.02,
    transparent: true,
    opacity: 0.7,
    depthTest: false,
  });

  const polygonMat = new THREE.MeshBasicMaterial({
    color: 0x0088ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
  });

  const getFrame = (verts) => {
    const origin = verts[0];
    const axisX = new THREE.Vector3().subVectors(verts[1], origin).normalize();
    const normal = new THREE.Vector3()
      .crossVectors(axisX, new THREE.Vector3().subVectors(verts[2], origin))
      .normalize();
    const axisY = new THREE.Vector3().crossVectors(normal, axisX).normalize();
    return { origin, axisX, axisY };
  };

  const to2D = (verts, origin, axisX, axisY) =>
    verts.map((v) => {
      const l = new THREE.Vector3().subVectors(v, origin);
      return new THREE.Vector2(l.dot(axisX), l.dot(axisY));
    });

  const segsCross = (p1, p2, p3, p4) => {
    const dx1 = p2.x - p1.x,
      dy1 = p2.y - p1.y;
    const dx2 = p4.x - p3.x,
      dy2 = p4.y - p3.y;
    const denom = dx1 * dy2 - dy1 * dx2;
    if (Math.abs(denom) < 1e-10) return false;
    const t = ((p3.x - p1.x) * dy2 - (p3.y - p1.y) * dx2) / denom;
    const u = ((p3.x - p1.x) * dy1 - (p3.y - p1.y) * dx1) / denom;
    const e = 1e-10;
    return t > e && t < 1 - e && u > e && u < 1 - e;
  };

  const isSelfIntersecting = (pts) => {
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const a = pts[i],
        b = pts[(i + 1) % n];
      for (let j = i + 2; j < n; j++) {
        if (i === 0 && j === n - 1) continue;
        if (segsCross(a, b, pts[j], pts[(j + 1) % n])) return true;
      }
    }
    return false;
  };

  const getOrderedVertices = () => {
    if (vertices.length < 3) return vertices;
    const { origin, axisX, axisY } = getFrame(vertices);
    const pts2D = to2D(vertices, origin, axisX, axisY);
    if (!isSelfIntersecting(pts2D)) return vertices;

    const cx = pts2D.reduce((s, p) => s + p.x, 0) / pts2D.length;
    const cy = pts2D.reduce((s, p) => s + p.y, 0) / pts2D.length;
    return vertices
      .map((v, i) => ({
        v,
        angle: Math.atan2(pts2D[i].y - cy, pts2D[i].x - cx),
      }))
      .sort((a, b) => a.angle - b.angle)
      .map((x) => x.v);
  };

  const placeMarker = (localPosition) => {
    const mat = new THREE.MeshBasicMaterial({
      color: COLOR_DEFAULT,
      side: THREE.DoubleSide,
      depthTest: false,
    });

    const geom = new THREE.RingGeometry(0.008, 0.015, 32).rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geom, mat);

    mesh.position.copy(localPosition);
    mesh.renderOrder = 2;

    anchorGroup.add(mesh);
    markers.push(mesh);
  };

  const updateLines = () => {
    if (lineLoop) {
      anchorGroup.remove(lineLoop);
      lineLoop.geometry.dispose();
      lineLoop = null;
    }
    if (vertices.length < 2) return;

    const ordered = getOrderedVertices();
    const points = [...ordered];
    if (ordered.length >= 3) points.push(ordered[0]);

    lineLoop = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      lineMat,
    );

    lineLoop.computeLineDistances();
    lineLoop.renderOrder = 1;
    anchorGroup.add(lineLoop);
  };

  const buildPolygon = () => {
    if (polygon) {
      anchorGroup.remove(polygon);
      polygon.geometry.dispose();
      polygon = null;
    }
    if (vertices.length < 3) return;

    const ordered = getOrderedVertices();
    const { origin, axisX, axisY } = getFrame(ordered);
    const points2D = to2D(ordered, origin, axisX, axisY);
    const geometry = new THREE.ShapeGeometry(new THREE.Shape(points2D));

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const local = new THREE.Vector3()
        .copy(origin)
        .addScaledVector(axisX, pos.getX(i))
        .addScaledVector(axisY, pos.getY(i));
      pos.setXYZ(i, local.x, local.y, local.z);
    }
    pos.needsUpdate = true;
    polygon = new THREE.Mesh(geometry, polygonMat);
    polygon.renderOrder = 0;
    anchorGroup.add(polygon);
  };

  const refreshGeometry = () => {
    updateLines();
    if (vertices.length >= 3) {
      buildPolygon();
    } else if (polygon) {
      anchorGroup.remove(polygon);
      polygon.geometry.dispose();
      polygon = null;
    }

    if (polygon) {
      polygon.material.opacity = selectedIndex !== null ? 0.05 : 0.15;
    }
  };

  const reset = () => {
    vertices.length = 0;
    markers.forEach((m) => {
      m.material.dispose();
      m.geometry.dispose();
      anchorGroup.remove(m);
    });
    markers.length = 0;
    if (lineLoop) {
      anchorGroup.remove(lineLoop);
      lineLoop.geometry.dispose();
      lineLoop = null;
    }
    if (polygon) {
      anchorGroup.remove(polygon);
      polygon.geometry.dispose();
      polygon = null;
    }
    selectedIndex = null;
  };

  const deleteSelectedVertex = () => {
    if (selectedIndex === null) return;
    const marker = markers[selectedIndex];
    anchorGroup.remove(marker);
    marker.geometry.dispose();
    marker.material.dispose();

    markers.splice(selectedIndex, 1);
    vertices.splice(selectedIndex, 1);
    selectedIndex = null;
    refreshGeometry();
  };

  const findNearest = (localPosition) => {
    let minDist = SNAP_DIST,
      nearest = -1;
    vertices.forEach((v, i) => {
      const d = localPosition.distanceTo(v);
      if (d < minDist) {
        minDist = d;
        nearest = i;
      }
    });
    return nearest;
  };

  const onReticleMove = (worldPosition) => {
    const localPosition = anchorGroup.worldToLocal(worldPosition.clone());
    if (selectedIndex !== null) {
      vertices[selectedIndex].copy(localPosition);
      markers[selectedIndex].position.copy(localPosition);
      refreshGeometry();
      return "editing";
    }
    const nearest = findNearest(localPosition);
    markers.forEach((m, i) =>
      m.material.color.setHex(i === nearest ? COLOR_HOVER : COLOR_DEFAULT),
    );
    return nearest !== -1 ? "hovering" : "placing";
  };

  const onTap = (worldPosition) => {
    const localPosition = anchorGroup.worldToLocal(worldPosition.clone());
    if (selectedIndex !== null) {
      vertices[selectedIndex].copy(localPosition);
      markers[selectedIndex].position.copy(localPosition);
      markers[selectedIndex].material.color.setHex(COLOR_DEFAULT);
      selectedIndex = null;
      refreshGeometry();
      return;
    }
    const nearest = findNearest(localPosition);
    if (nearest !== -1) {
      selectedIndex = nearest;
      markers[selectedIndex].material.color.setHex(COLOR_EDITING);
      refreshGeometry();
      return;
    }

    vertices.push(localPosition.clone());
    placeMarker(localPosition);
    refreshGeometry();
  };

  const getVertices = () => vertices.map((v) => ({ x: v.x, y: v.y, z: v.z }));

  const loadVertices = (localCoords) => {
    reset();
    localCoords.forEach((c) => {
      const vec = new THREE.Vector3(c.x, c.y, c.z);
      vertices.push(vec);
      placeMarker(vec);
    });
    refreshGeometry();
  };

  return {
    onTap,
    onReticleMove,
    reset,
    getVertices,
    loadVertices,
    deleteSelectedVertex,
  };
}
