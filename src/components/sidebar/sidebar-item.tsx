import { type DragEvent, useRef } from 'react';

import Shape from '../shape';
import { type ShapeType } from '../shape/types';
import { Tooltip } from 'react-tooltip'

type SidebarItemProps = {
  type: ShapeType;
};

function camelCaseToRegular(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before each uppercase letter
    .replace(/^./, (char) => char.toUpperCase()); // Capitalize the first letter
}

function SidebarItem({ type }: SidebarItemProps) {
  const dragImageRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer?.setData('application/reactflow', type);

    if (dragImageRef.current) {
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
  };

  return (
    <>
    <div className="sidebar-item" draggable onDragStart={onDragStart} data-tooltip-id="my-tooltip" data-tooltip-content={camelCaseToRegular(`${type}`)}>
      <Shape
        type={type}
        fill="white"
        strokeWidth={1}
        // width={28}
        // height={28}
        width={56}
        height={42}
        
      />
      
      <div className="sidebar-item-drag-image" ref={dragImageRef}>
        <Shape
          type={type}
          width={56}
          height={42}
          fill="white"
          fillOpacity={0.7}
          stroke="#3F8AE2"
          strokeWidth={2}
          
        />
      </div>
    
    </div>
    <Tooltip id="my-tooltip" place="right" />
    </>
  );
}

export default SidebarItem;
