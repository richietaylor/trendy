// import SidebarItem from './sidebar-item';
// import { ShapeComponents, ShapeType } from '../shape/types';

// function Sidebar() {
//   return (
//     <div className='sidebar'>
//       <div className='sidebar-label'>Drag shapes to the canvas</div>
//       <div className='sidebar-items'>
//         {Object.keys(ShapeComponents).map((type) => (
//           <SidebarItem type={type as ShapeType} key={type} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Sidebar;


import React, { useState } from 'react';
import SidebarItem from './sidebar-item';
import { ShapeComponents, ShapeType } from '../shape/types';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>

      
      {/* <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}> */}
        {/* <button onClick={toggleSidebar} className="sidebar-toggle-button">
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button> */}
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button onClick={toggleSidebar} className="sidebar-toggle-button">
        <span className={`toggle-icon ${isCollapsed ? 'collapsed' : 'expanded'}`}>&#9654;</span>
      </button>
        {!isCollapsed && (
          <>
            {/* <div className='sidebar-label'>Drag shapes to the canvas</div> */}
            <div className='sidebar-items'>
              {Object.keys(ShapeComponents).map((type) => (
                <SidebarItem type={type as ShapeType} key={type} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Sidebar;
