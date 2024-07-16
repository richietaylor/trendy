// src/Sidebar.jsx
import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 200px;
  padding: 10px;
  background: #f7f7f7;
  border-right: 1px solid #ddd;
`;

const SidebarItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: grab;
`;

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarItem onDragStart={(event) => onDragStart(event, 'entity')} draggable>
        Entity
      </SidebarItem>
      <SidebarItem onDragStart={(event) => onDragStart(event, 'attribute')} draggable>
        Attribute
      </SidebarItem>
    </SidebarContainer>
  );
};

export default Sidebar;
