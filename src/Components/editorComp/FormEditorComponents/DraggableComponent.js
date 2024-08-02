import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useDrag } from "react-dnd";

function DraggableComponent(props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "component",
    item: { id: props.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  //   const { attributes, listeners, setNodeRef, transform } = useDraggable({
  //     id: props.id,
  //   });
  //   const style = transform
  //     ? {
  //         transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  //       }
  //     : undefined;

  return (
    <button ref={drag} style={{ border: isDragging ? "5px solid pink" : "" }}>
      {props.children}
    </button>
  );
}
export default DraggableComponent;
