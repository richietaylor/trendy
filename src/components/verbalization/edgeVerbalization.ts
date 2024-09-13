import { Edge } from '@xyflow/react';
import { ShapeNode } from 'components/shape/types';

// type EdgeVerbalizationProps = {
//   selectedEdge: Edge | null;
//   nodes: ShapeNode[];
//   timeQuanta?: 'day' | 'year';
// };

export const generateEdgeVerbalization = (
  selectedEdge: Edge,
  nodes: ShapeNode[],
  timeQuanta: string,
  // props: EdgeVerbalizationProps
): string => {
  if (!selectedEdge) {
    return '';
  }

  // Swap source and target nodes if necessary
  const targetNode = nodes.find(node => node.id === selectedEdge.source);
  const sourceNode = nodes.find(node => node.id === selectedEdge.target);

  if (!sourceNode || !targetNode) {
    return '';
  }

  // Extract edge properties
  const { type: edgeType, data, style } = selectedEdge;
  const { label: edgeLabel = "chg", optional = 'Mandatory', persistent = false, quantitative = false, value } = data || {};

  // Extract source and target node properties
  const sourceNodeType = sourceNode.data.type;
  const targetNodeType = targetNode.data.type;
  const sourceNodeLabel = sourceNode.data.label;
  const targetNodeLabel = targetNode.data.label;
  const maybe = '';

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
  let verbalization = '';

  const isEntity = ['temporalEntity', 'atemporalEntity', 'weakEntity'].includes(String(sourceNodeType)) && ['temporalEntity', 'atemporalEntity', 'weakEntity'].includes(String(targetNodeType));
  const isRelationship = ['temporalRelationship', 'atemporalRelationship', 'weakRelationship'].includes(String(sourceNodeType)) && ['temporalRelationship', 'atemporalRelationship', 'weakRelationship'].includes(String(targetNodeType));


  if (isEntity) {
    if (quantitative === undefined || quantitative === false) {
      if (optional === 'Optional') {
        if (edgeLabel === 'chg') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may have been ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now`;
        } else if (edgeLabel === 'CHG') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(targetNodeLabel)))} ${targetNodeLabel} may evolve to become ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel} ceasing to be ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel}`;
        } else if (edgeLabel === 'ext') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may have been ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before`;
        } else if (edgeLabel === 'EXT') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(targetNodeLabel)))} ${targetNodeLabel} may also become ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel}`;
        }
      } else if (optional === 'Mandatory') {
        if (edgeLabel === 'chg') {
          verbalization += `Each ${sourceNodeLabel} was ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now`;
        } else if (edgeLabel === 'CHG') {
          verbalization += `Each ${targetNodeLabel} must evolve to ${sourceNodeLabel} ceasing to be ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel}`;
        } else if (edgeLabel === 'ext') {
          verbalization += `Each ${sourceNodeLabel} was already ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel}`;
        } else if (edgeLabel === 'EXT') {
          verbalization += `Each ${targetNodeLabel} also has to become ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel}`;
        }
      }
    } else if (quantitative === true) {
      if (optional === 'Optional') {
        if (edgeLabel === 'chg') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may have been ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before for a period of ${maybe}${value} ${timeQuanta}s, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now`;
        } else if (edgeLabel === 'CHG') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(targetNodeLabel)))} ${targetNodeLabel} may progress to ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel} after ${maybe}${value} ${timeQuanta}s, ceasing to be ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel}`;
        } else if (edgeLabel === 'ext') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(sourceNodeLabel)))} ${sourceNodeLabel} may already be ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} for ${maybe}${value} ${timeQuanta}s since ${value} ${timeQuanta}s`;
        } else if (edgeLabel === 'EXT') {
          verbalization += `${capitalizeFirstLetter(getIndefiniteArticle(String(targetNodeLabel)))} ${targetNodeLabel} may also become ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel} after ${maybe}${value} ${timeQuanta}s`;
        }
      } else if (optional === 'Mandatory') {
        if (edgeLabel === 'chg') {
          verbalization += `Each ${sourceNodeLabel} was ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} before for a period of ${maybe}${value} ${timeQuanta}s, but is not ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} now`;
        } else if (edgeLabel === 'CHG') {
          verbalization += `Each ${targetNodeLabel} must progress to ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel} after ${maybe}${value} ${timeQuanta}s, ceasing to be ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel}`;
        } else if (edgeLabel === 'ext') {
          verbalization += `Each ${sourceNodeLabel} was already ${getIndefiniteArticle(String(targetNodeLabel))} ${targetNodeLabel} for ${maybe}${value} ${timeQuanta}s since ${value} ${timeQuanta}s`;
        } else if (edgeLabel === 'EXT') {
          verbalization += `Each ${targetNodeLabel} will also become ${getIndefiniteArticle(String(sourceNodeLabel))} ${sourceNodeLabel} after ${maybe}${value} ${timeQuanta}s`;
        }
      }
    }
  }

  if (isRelationship) {
    if (optional === 'Optional') {
      if (edgeLabel === 'chg') {
        verbalization += `${sourceNodeLabel} may have been preceded by ${targetNodeLabel} and they are not in that ${targetNodeLabel} relation now`;
      } else if (edgeLabel === 'CHG') {
        verbalization += `${targetNodeLabel} may be followed by ${sourceNodeLabel}, ending ${targetNodeLabel}`;
      } else if (edgeLabel === 'ext') {
        verbalization += `${sourceNodeLabel} may be preceded by ${targetNodeLabel} some time earlier`;
      } else if (edgeLabel === 'EXT') {
        verbalization += `${targetNodeLabel} may be followed by ${sourceNodeLabel} some time later`;
      }
    } else if (optional === 'Mandatory') {
      if (edgeLabel === 'chg') {
        verbalization += `Each ${sourceNodeLabel} must have been preceded by ${targetNodeLabel}, and terminating that ${targetNodeLabel} relation`;
      } else if (edgeLabel === 'CHG') {
        verbalization += `Each ${targetNodeLabel} will be followed by ${sourceNodeLabel}, terminating the ${targetNodeLabel} relation`;
      } else if (edgeLabel === 'ext') {
        verbalization += `Each ${sourceNodeLabel} must have been preceded by ${targetNodeLabel} some time earlier`;
      } else if (edgeLabel === 'EXT') {
        verbalization += `Each ${targetNodeLabel} must be followed by ${sourceNodeLabel} some time later`;
      }
    }
  }

  if(isEntity || isRelationship)
  {
    if(persistent)
      {
        verbalization += `, and this remains so indefinitely.`
      }
      else{
        verbalization += '.'
      }
  }

//else fullstop - remove all other fullstops

  return verbalization;
};
