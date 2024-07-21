function NodeLabel(props: { placeholder: string }) {
  return (
    <input type='text' className='node-label' placeholder={props.placeholder} color="black"/>
  );
}

export default NodeLabel;
