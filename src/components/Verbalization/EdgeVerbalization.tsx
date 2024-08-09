import React from 'react';
import { Edge, Node } from '@xyflow/react';

type EdgeVerbalizationProps = {
  selectedEdge: Edge | null;
  nodes: Node[];
};

const EdgeVerbalization: React.FC<EdgeVerbalizationProps> = ({ selectedEdge, nodes }) => {
  if (!selectedEdge) {
    return null;
  }

  const sourceNode = nodes.find(node => node.id === selectedEdge.source);
  const targetNode = nodes.find(node => node.id === selectedEdge.target);

  if (!sourceNode || !targetNode) {
    return null;
  }
  
  // Extract edge properties
  const { type: edgeType, data, style } = selectedEdge;
  const { label: edgeLabel, optional, persistent, quantitative, value } = data || {};

  // Extract source and target node properties
  const sourceNodeType = sourceNode.data.type;
  const targetNodeType = targetNode.data.type;
  const sourceNodeLabel = sourceNode.data.label;
  const targetNodeLabel = targetNode.data.label;
  const quanta = ''
//   const maybe = '[at least/at most/exactly] '
  const maybe = ''

  const getIndefiniteArticle = (word: string) => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const firstLetter = word.charAt(0).toLowerCase();
    return vowels.includes(firstLetter) ? 'an' : 'a';
  };

  const capitalizeFirstLetter = (str: string): string => {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Placeholder for verbalization logic
  // let verbalization = `The edge connects ${sourceNode.data.label} (${sourceNode.type}) to ${targetNode.data.label} (${targetNode.type}) with an edge type of ${selectedEdge.type} and style ${JSON.stringify(selectedEdge.style)}`;
  let verbalization = ''

//   if sourceNodeType = 

  const isEntity = ['temporalEntity', 'atemporalEntity'].includes(String(sourceNodeType)) && ['temporalEntity', 'atemporalEntity'].includes(String(targetNodeType));
  const isRelationship = ['temporalRelationship', 'atemporalRelationship'].includes(String(sourceNodeType)) && ['temporalRelationship', 'atemporalRelationship'].includes(String(targetNodeType));


  if (isEntity) {
    // verbalization += ` Both of the nodes are entities.`;
    console.log('isEntity:', isEntity, 'optional:', optional, 'quantitative:', quantitative, 'edgeLabel:', edgeLabel);
    
    if(quantitative === false)
    {
        if(optional === 'Optional')
            {
                if(edgeLabel === 'chg')
                    {
                        verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may have been ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now.`
                        console.log(`${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may have been ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now.`)
                    }
                    else if(edgeLabel === 'CHG')
                    {
                        verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may evolve to become ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} ceasing to be ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel} .`
                    }
                    else if(edgeLabel === 'ext')
                    {
                        verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may have been ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before.`
                    }
                    else if(edgeLabel === 'EXT')
                    {
                        verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may also become ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} .`
                    }
            }
            else if(optional === 'Mandatory')
            {
                if(edgeLabel === 'chg')
                    {
                        verbalization += `Each ${sourceNodeLabel} was ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now.`
                    }
                    else if(edgeLabel === 'CHG')
                    {
                        verbalization += `Each ${sourceNodeLabel} must evolve to ${targetNodeLabel} ceasing to be ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel}.`
                    }
                    else if(edgeLabel === 'ext')
                    {
                        verbalization += `Each ${sourceNodeLabel} was already ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel}.`
                    }
                    else if(edgeLabel === 'EXT')
                    {
                        verbalization += `Each ${sourceNodeLabel} also has to become ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel}.`
                    }
            }
    }
    else if(quantitative === true)
        {
            if(optional === 'Optional')
                {
                    if(edgeLabel === 'chg')
                        {
                            verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may have been ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before for a period of ${maybe}${value} ${quanta}, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now.`
                        }
                        else if(edgeLabel === 'CHG')
                        {
                            verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may progress to ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} after ${maybe}${value} ${quanta}, ceasing to be ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel}.`
                        }
                        else if(edgeLabel === 'ext')
                        {
                            verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may already be ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} for ${maybe}${value} ${quanta} since ${value} ${quanta}.`
                        }
                        else if(edgeLabel === 'EXT')
                        {
                            verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may also become ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} after ${maybe}${value} ${quanta}.`
                        }
                }
                else if(optional === 'Mandatory')
                {
                    if(edgeLabel === 'chg')
                        {
                            verbalization += `Each ${sourceNodeLabel} was ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before for a period of ${maybe}${value} ${quanta}, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now.`
                        }
                        else if(edgeLabel === 'CHG')
                        {
                            verbalization += `Each ${sourceNodeLabel} must progress to ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} after ${maybe}${value} ${quanta} , ceasing to be ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel}.`
                        }
                        else if(edgeLabel === 'ext')
                        {
                            verbalization += `Each ${sourceNodeLabel} was already ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} for ${maybe}${value} ${quanta} since ${value} ${quanta} .`
                        }
                        else if(edgeLabel === 'EXT')
                        {
                            verbalization += `Each ${sourceNodeLabel} will also become ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} after ${maybe}${value} ${quanta}.`
                        }
                }
        }
  }

  if (isRelationship) {
    // verbalization += ` Both of the nodes are relationships.`;
    if(optional === 'Optional')
        {
            if(edgeLabel === 'chg')
                {
                    verbalization += `..C1.. ..R1.. ..C2.. may have been preceded by ..C1.. ..R2.. ..C2.. and they are not in that ..C1.. ..R2.. ..C2.. relation now.`
                }
                else if(edgeLabel === 'CHG')
                {
                    verbalization += `..C1.. ..R1.. ..C2.. may be followed by ..C1.. ..R2.. ..C2.. , ending ..C1.. ..R1.. ..C2..`
                }
                else if(edgeLabel === 'ext')
                {
                    verbalization += `${sourceNodeLabel} ..R1.. ..C2.. may be preceded by ..C1.. ..R2.. ..C2.. some time earlier.`
                }
                else if(edgeLabel === 'EXT')
                {
                    verbalization += `..C1.. ..R1.. ..C2.. may be followed by ..C1.. ..R2.. ..C2.. some time later.`
                }
        }
        else if(optional === 'Madatory')
        {
            if(edgeLabel === 'chg')
                {
                    verbalization += `Each ..C1.. ..R1.. ..C2.. must have been preceded by ..C1.. ..R2.. ..C2.., and terminating that ..C1.. ..R2.. ..C2.. relation.`
                }
                else if(edgeLabel === 'CHG')
                {
                    verbalization += `Each ..C1.. ..R1.. ..C2.. will be followed by ..C1.. ..R2.. ..C2.. , terminating the ..C1.. ..R1.. ..C2.. relation.`
                }
                else if(edgeLabel === 'ext')
                {
                    verbalization += `Each ..C1.. ..R1.. ..C2.. was preceded by ..C1.. ..R2.. ..C2.. some time earlier.`
                }
                else if(edgeLabel === 'EXT')
                {
                    verbalization += `Each ..C1.. ..R1.. ..C2.. will be followed by ..C1.. ..R2.. ..C2.. .`
                }
        }
  }

  if(persistent)
  {
    verbalization += ` and this remains so indefinitely.`
  }
//else fullstop - remove all other fullstops

  return (
    <div style={{ position: 'absolute', bottom: 50, left: 20, background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10 }}>
      <p>{verbalization}</p>
    </div>
  );
};

export default EdgeVerbalization;
