# Shapes Editor

This pro example shows how to implement an editor for flowcharts and diagrams. It contains a resizable custom node component that can render different shapes as well as common editor ui components such as a sidebar and interactive minimap.

## Dependencies

- reactflow@11.10.1

## Breakdown

### Implementing the shape component

The key parts of this example is a reusable component that renders a svg containing a shape with certain dimensions. To add your own shape, you can add it to `/src/components/shape/types`.

Each shape gets the same props passed from the wrapper component and returns an svg `path` based on the dimensions. As an example, this component renders a diamond shape:

```ts
function Diamond({ width, height, ...svgAttributes }: ShapeProps) {
  // The `generatePath` function is a helper that turns an array of points into an svg path definition
  const diamondPath = generatePath([
    [0, height / 2],
    [width / 2, 0],
    [width, height / 2],
    [width / 2, height],
  ]);

  return <path d={diamondPath} {...svgAttributes} />;
}
```

By making the wrapper component (/src/components/shape/index.tsx) accept a `type` prop (string), we can render any shape that we have registered and wrap it with an svg element:

```tsx
// simplified, for full implementation see: /src/components/shape/index.tsx
function Shape({ type }: { type: string }) {
  // this returns the shape component (for example the diamond we have created above)
  const ShapeComponent = ShapeComponents[type];

  return (
    <svg>
      <ShapeComponent />
    </svg>
  );
}
```

### Implementing the custom shape node

Now that we have a component rendering the shape, we can create our custom node with it:

```tsx
// simplified, for full implementation see: src/components/shape-node/index.tsx
function ShapeNode({ data }) {
  const { width, height } = useNodeDimensions(id);

  return (
    <Shape
      type={data.type}
      width={width}
      height={height}
      fill={data.color}
      strokeWidth={2}
      stroke={data.color}
      fillOpacity={0.8}
    />
  );
}
```

By rendering the shape based on the data passed to the node, we have full control over the node from the node options. So, we can define our nodes like this:

```ts
const nodes = [
  {
    id: 'diamond-node',
    // we are using the same node type for all nodes
    type: 'shape',
    // the color and type of the shape is defined in the data option
    data: { type: 'diamond', color: '#ff0071' },
    // the initial dimensions that the node will be rendered with
    style: { width: 300, height: 300 },
    position: { x: 100, y: 100 },
  },
];
```

In the actual implementation, there are other pieces added to the custom node such as a `NodeToolbar` to edit the color, an editable node label and a `NodeResizer` to change the dimensions of the node.

### Reusing the shapes component

The shapes component is reused multiple times in our application:

1. Inside our custom node to render the shape node
2. Within the sidebar component as a little icon of the shape it will create
3. In the minimap node to render the actual shape of the nodes in the minimap

## Related docs:

You can read more about some of React Flow features we're using in this example here:

- [Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [NodeResizer](https://reactflow.dev/api-reference/components/node-resizer)
- [NodeToolbar](https://reactflow.dev/api-reference/components/node-toolbar)
- [Panel](https://reactflow.dev/api-reference/components/panel)

## See also:

- [Can you control how an SVG's stroke-width is drawn?](https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn): Because the stroke of an svg can't be drawn inside of a shape, we are subtracting the stroke width from the svg size so that it doesn't overflow.
- [Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths): Detailed explanation on how to draw SVG paths manually
