import "./SelectionWindow.css";
import {jsx as $gYv1Q$jsx} from "react/jsx-runtime";
import $gYv1Q$react from "react";
import $gYv1Q$reacthooksize from "@react-hook/size";

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}



var $118eac5423b196c3$exports = {};

$parcel$export($118eac5423b196c3$exports, "component", () => $118eac5423b196c3$export$d8556a2a8f973135, (v) => $118eac5423b196c3$export$d8556a2a8f973135 = v);
$parcel$export($118eac5423b196c3$exports, "selection", () => $118eac5423b196c3$export$7c69810f7b8835c9, (v) => $118eac5423b196c3$export$7c69810f7b8835c9 = v);
var $118eac5423b196c3$export$d8556a2a8f973135;
var $118eac5423b196c3$export$7c69810f7b8835c9;
$118eac5423b196c3$export$d8556a2a8f973135 = `wAMUBW_component`;
$118eac5423b196c3$export$7c69810f7b8835c9 = `wAMUBW_selection`;


function $d6226421cd976098$export$c2644827bcb91f96({ children: children , className: className , mouseThreshold: mouseThreshold = 30 , touchThreshold: touchThreshold = 60  }) {
    const [node, setNode] = (0, $gYv1Q$react).useState(null);
    const selectionRef = (0, $gYv1Q$react).useRef(null);
    const frameRef = (0, $gYv1Q$react).useRef(null);
    const cropZoneRef = (0, $gYv1Q$react).useRef(null);
    const stateRef = (0, $gYv1Q$react).useRef({
        dragging: false,
        pointers: new Map(),
        edges: []
    });
    const [containerWidth, containerHeight] = (0, $gYv1Q$reacthooksize)(node);
    if (containerWidth && containerHeight && cropZoneRef.current === null) cropZoneRef.current = {
        left: containerWidth * 0.25,
        top: containerHeight * 0.25,
        right: containerWidth * 0.75,
        bottom: containerHeight * 0.75,
        containerWidth: containerWidth,
        containerHeight: containerHeight
    };
    (0, $gYv1Q$react).useEffect(()=>{
        if (!node) return;
        node.addEventListener("touchmove", handleTouchMove);
        node.addEventListener("pointerdown", handleDragStart);
        node.addEventListener("pointermove", handleDrag, {
            passive: true
        });
        node.addEventListener("pointerup", handleDragEnd);
        node.addEventListener("pointercancel", handleDragEnd);
        return ()=>{
            node.removeEventListener("touchmove", handleTouchMove);
            node.removeEventListener("pointerdown", handleDragStart);
            node.removeEventListener("pointermove", handleDrag, {
                passive: true
            });
            node.removeEventListener("pointerup", handleDragEnd);
            node.removeEventListener("pointercancel", handleDragEnd);
        };
    }, [
        node
    ]);
    return /*#__PURE__*/ (0, $gYv1Q$jsx)("div", {
        ref: setNode,
        className: $d6226421cd976098$var$cx(className, (0, (/*@__PURE__*/$parcel$interopDefault($118eac5423b196c3$exports))).component),
        children: /*#__PURE__*/ (0, $gYv1Q$jsx)("div", {
            ref: selectionRef,
            className: (0, (/*@__PURE__*/$parcel$interopDefault($118eac5423b196c3$exports))).selection,
            style: {
                position: "absolute",
                left: $d6226421cd976098$var$px(cropZoneRef.current?.left ?? 0),
                top: $d6226421cd976098$var$px(cropZoneRef.current?.top ?? 0),
                width: $d6226421cd976098$var$px((cropZoneRef.current?.right ?? 0) - (cropZoneRef.current?.left ?? 0)),
                height: $d6226421cd976098$var$px((cropZoneRef.current?.bottom ?? 0) - (cropZoneRef.current?.top ?? 0))
            },
            children: children
        })
    });
    function handleDragStart(e) {
        e.preventDefault();
        const { clientX: x , clientY: y  } = e;
        const threshold = e.pointerType === "mouse" ? mouseThreshold : touchThreshold;
        const pointerState = getPointerState({
            x: x,
            y: y,
            threshold: threshold
        });
        stateRef.current.dragging = true;
        stateRef.current.pointers.set(e.pointerId, pointerState);
        stateRef.current.edges = stateRef.current.edges.concat(pointerState.edges);
    }
    function handleTouchMove(e) {
        if (!stateRef.current.dragging) return;
        e.preventDefault();
    }
    function handleDrag(e) {
        if (!stateRef.current.dragging) return;
        const pointerState = stateRef.current.pointers.get(e.pointerId);
        const x = e.clientX - pointerState.dx;
        const y = e.clientY - pointerState.dy;
        const threshold = e.pointerType === "mouse" ? mouseThreshold : touchThreshold;
        if (pointerState.edges.length) {
            transformSelection({
                pointerState: pointerState,
                x: x,
                y: y,
                threshold: threshold
            });
        } else if (stateRef.current.pointers.size === 1) {
            moveSelection({
                dx: e.movementX,
                dy: e.movementY
            });
        }
        updateSelection();
    }
    function handleDragEnd(e) {
        if (!stateRef.current.pointers.has(e.pointerId)) return; // Drag already ended, multiple events can end dragging
        const { edges: edges  } = stateRef.current.pointers.get(e.pointerId);
        stateRef.current.edges = stateRef.current.edges.filter((x)=>!edges.includes(x));
        stateRef.current.pointers.delete(e.pointerId);
        stateRef.current.dragging = false;
    }
    function getPointerState({ x: x , y: y , threshold: threshold  }) {
        const edges = [];
        const dl = x - cropZoneRef.current.left;
        const dr = x - cropZoneRef.current.right;
        const dt = y - cropZoneRef.current.top;
        const db = y - cropZoneRef.current.bottom;
        const adl = Math.abs(dl);
        const adr = Math.abs(dr);
        const adt = Math.abs(dt);
        const adb = Math.abs(db);
        if (adl <= adr && adl < threshold) edges.push("left");
        else if (adr <= adl && adr < threshold) edges.push("right");
        if (adt <= adb && adt < threshold) edges.push("top");
        else if (adb <= adt && adb < threshold) edges.push("bottom");
        return {
            dx: edges.includes("left") ? dl : edges.includes("right") ? dr : 0,
            dy: edges.includes("top") ? dt : edges.includes("bottom") ? db : 0,
            edges: edges.filter((x)=>!stateRef.current.edges.includes(x))
        };
    }
    function transformSelection({ pointerState: pointerState , x: x , y: y , threshold: threshold  }) {
        if (pointerState.edges.includes("left")) {
            cropZoneRef.current.left = x;
            cropZoneRef.current.right = Math.max(cropZoneRef.current.right, x + threshold);
        } else if (pointerState.edges.includes("right")) {
            cropZoneRef.current.right = x;
            cropZoneRef.current.left = Math.min(cropZoneRef.current.left, x - threshold);
        }
        if (pointerState.edges.includes("top")) {
            cropZoneRef.current.top = y;
            cropZoneRef.current.bottom = Math.max(cropZoneRef.current.bottom, y + threshold);
        } else if (pointerState.edges.includes("bottom")) {
            cropZoneRef.current.bottom = y;
            cropZoneRef.current.top = Math.min(cropZoneRef.current.top, y - threshold);
        }
    }
    function moveSelection({ dx: dx , dy: dy  }) {
        const clampedDx = $d6226421cd976098$var$clamp(-cropZoneRef.current.left, cropZoneRef.current.containerWidth - cropZoneRef.current.right, dx);
        const clampedDy = $d6226421cd976098$var$clamp(-cropZoneRef.current.top, cropZoneRef.current.containerHeight - cropZoneRef.current.bottom, dy);
        cropZoneRef.current.left += clampedDx;
        cropZoneRef.current.right += clampedDx;
        cropZoneRef.current.top += clampedDy;
        cropZoneRef.current.bottom += clampedDy;
    }
    function updateSelection() {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(()=>{
            Object.assign(selectionRef.current.style, {
                position: "absolute",
                left: $d6226421cd976098$var$px(cropZoneRef.current.left),
                top: $d6226421cd976098$var$px(cropZoneRef.current.top),
                width: $d6226421cd976098$var$px(cropZoneRef.current.right - cropZoneRef.current.left),
                height: $d6226421cd976098$var$px(cropZoneRef.current.bottom - cropZoneRef.current.top)
            });
        });
    }
}
function $d6226421cd976098$var$px(n) {
    return n + "px";
}
function $d6226421cd976098$var$clamp(left, right, value) {
    const [min, max] = left < right ? [
        left,
        right
    ] : [
        right,
        left
    ];
    return Math.max(min, Math.min(max, value));
}
function $d6226421cd976098$var$cx(...classes) {
    return classes.filter(Boolean).join(" ");
}


export {$d6226421cd976098$export$c2644827bcb91f96 as SelectionWindow};
//# sourceMappingURL=SelectionWindow.js.map
