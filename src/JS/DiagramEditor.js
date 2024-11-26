import React, { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import '../CSS/DiagramEditor.css';
import html2canvas from 'html2canvas';

const DiagramEditor = ({onGenerate}) => {
  const diagramRef = useRef(null);
  const selectedElements = useRef([]);
  const graphRef = useRef(new joint.dia.Graph());
  const paperRef = useRef(null);
  const [SystemName, setSystemName] = useState('');
  const toolbarRef = useRef(null);
  const [isToolbarReady, setIsToolbarReady] = useState(false);

  /*const exportDiagramToText = async () => {
    try {

      const UseCaseDiagramData = JSON.stringify(graphRef.current.toJSON());

      if (!UseCaseDiagramData || UseCaseDiagramData === '{"cells":[]}') {
        console.error('Error: Diagram data is empty or invalid.');
        alert('The diagram is empty. Please create a valid diagram before generating.');
        return;
      }
  
      const diagramData = {
        SystemName,
        UseCaseDiagramData,
      };

      console.log(diagramData);
  
      onGenerate(diagramData);
    } catch (error) {
      console.error('An error occurred during export:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };*/

  const exportDiagramToText = async () => {

      const diagramData = JSON.stringify(graphRef.current.toJSON());

      if (!diagramData || diagramData === '{"cells":[]}') {
        console.error('Error: Diagram data is empty or invalid.');
        alert('The diagram is empty. Please create a valid diagram before generating.');
        return;
      }
  
      onGenerate(diagramData);
  };
  

  const handleGenerateButtonClick = () => {
    exportDiagramToText();
  };

  let currentScale = 1;
  let startPanningPosition = { x: 0, y: 0 };

  const zoomIn = () => {
    currentScale += 0.1;
    paperRef.current.scale(currentScale, currentScale);
  };

  const zoomOut = () => {
    const minScale = 0.5; 
    if (currentScale > minScale) {
      currentScale = Math.max(currentScale - 0.1, minScale);
      paperRef.current.scale(currentScale, currentScale);
    }
  };

  useEffect(() => {
    const graph = new joint.dia.Graph();
    graphRef.current = graph;

    const paper = new joint.dia.Paper({
      el: diagramRef.current,
      model: graph,
      width: 600,
      async: true,
      height: 530,
      gridSize: 10,
      drawGrid: true,
      interactive: true,

      restrictTranslate: false
    });

    paperRef.current = paper;

    paper.on('blank:mousewheel', (evt, x, y, delta) => {
      if (delta > 0) zoomIn();
      else zoomOut();
    });

    let panning = false;

    paper.on('blank:pointerdown', (evt, x, y) => {
      panning = true;
      startPanningPosition = { x, y };
      paper.$el.css('cursor', 'move');
    });

    paper.on('cell:pointerup blank:pointerup', () => {
      panning = false;
      paper.$el.css('cursor', 'default');
    });

    paper.on('blank:pointermove', (evt, x, y) => {
      if (panning) {
        const dx = x - startPanningPosition.x;
        const dy = y - startPanningPosition.y;

        const translate = paper.translate();
        paper.translate(translate.tx + dx, translate.ty + dy);

        startPanningPosition = { x, y };
      }
    });

    const addUseCase = () => {
      const text = 'New Use Case'; // Label text
      const fontSize = 14; // Font size for the label
      const padding = 20; // Extra space around the text for padding
  
      // Create a temporary element to measure the text width
      const tempElement = document.createElement('canvas');
      const context = tempElement.getContext('2d');
      context.font = `${fontSize}px Arial`; // Use the same font style as in your ellipse
      const textWidth = context.measureText(text).width;
  
      // Dynamically adjust ellipse width based on text width
      const ellipseWidth = Math.max(textWidth + padding, 150); // Ensure minimum width is 120
      const ellipseHeight = 80; // Fixed height for the ellipse
  
      // Create the ellipse
      const ellipse = new joint.shapes.standard.Ellipse({
          position: { x: 100, y: 100 },
          size: { width: ellipseWidth, height: ellipseHeight },
          attrs: {
              body: { fill: '#3A6D8C', stroke: 'none' },
              label: { text: text, fill: 'white', fontSize: fontSize }
          },
          type: 'usecase'
      });
  
      // Add the ellipse to the graph
      ellipse.addTo(graph);
  };
    
  const addActor = () => {
    // Create a custom stickman actor
    const stickman = new joint.dia.Element({
        position: { x: 300, y: 100 }, // Initial position
        size: { width: 30, height: 100 }, // Size of the stickman
        markup: `
          <g class="scalable">
            <circle class="head"/>
            <line class="body"/>
            <line class="arm-left"/>
            <line class="arm-right"/>
            <line class="leg-left"/>
            <line class="leg-right"/>
            <text class="label"/>
          </g>
        `,
        attrs: {
            '.head': { 
                cx: 25, cy: 15, r: 15, fill: 'black' // Circle for the head
            },
            '.body': { 
                x1: 25, y1: 30, x2: 25, y2: 60, stroke: 'black', strokeWidth: 2 // Vertical line for the body
            },
            '.arm-left': { 
                x1: 10, y1: 40, x2: 25, y2: 40, stroke: 'black', strokeWidth: 2 // Left arm
            },
            '.arm-right': { 
                x1: 25, y1: 40, x2: 40, y2: 40, stroke: 'black', strokeWidth: 2 // Right arm
            },
            '.leg-left': { 
                x1: 25, y1: 60, x2: 15, y2: 90, stroke: 'black', strokeWidth: 2 // Left leg
            },
            '.leg-right': { 
                x1: 25, y1: 60, x2: 35, y2: 90, stroke: 'black', strokeWidth: 2 // Right leg
            },
            '.label': { 
                text: 'Actor', // Label text
                refX: '50%',
                refY: '100%',
                refY2: 10,
                textAnchor: 'middle',
                fill: 'black',
                fontSize: 12
            }
        },
        type: 'actor' // Custom type for the element
    });

    // Add the stickman actor to the graph
    stickman.addTo(graph);
};    
    

    const addBrokenArrow = () => {
      if (selectedElements.current.length === 2) {
        const sourceElement = graph.getCell(selectedElements.current[0].id); 
        const targetElement = graph.getCell(selectedElements.current[1].id); 
    
        if (sourceElement && targetElement) {
          const input = document.createElement('input');
          input.type = 'text';
          input.placeholder = 'Enter relationship type';
          
          input.style.position = 'absolute';
          input.style.width = '200px';
          input.style.left = `${targetElement.position().x + 98}px`;
          input.style.transform = 'translateX(-50%)';
          input.style.bottom = `${window.innerHeight - toolbarRef.current.offsetTop - 55}px`;

          input.style.backgroundColor = '#ffff'; 
          input.style.border = '1px solid #001F3F';   
          input.style.padding = '5px';           
          input.style.borderRadius = '5px';
          input.style.fontSize = '12px';

          document.body.appendChild(input);
    
          const removeInput = () => {
            if (input.parentNode) {
              document.body.removeChild(input);
            }
          };
    
          input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              const relationshipType = input.value.trim();
              if (relationshipType === '<<include>>' || relationshipType === '<<extend>>') {
                const link = new joint.shapes.standard.Link({
                  type: 'Relationship', 
                  attrs: {
                    line: {
                      stroke: '#001F3F',
                      strokeWidth: 2,
                      strokeDasharray: '5,5',
                      targetMarker: {
                        type: 'path',
                        d: 'M 10 -5 0 0 10 5 Z',
                        fill: '#001F3F',
                      },
                    },
                  },
                  label: relationshipType
                });

                link.source({ id: sourceElement.id });
                link.target({ id: targetElement.id });
                link.addTo(graph);
    
                const label = new TextElement({
                  attrs: {
                    label: {
                      text: relationshipType 
                    }
                  }
                });
                label.position(200, 200); 
                label.addTo(graph);
        
                selectedElements.current.forEach(selected => {
                  selected.element.attr('body/stroke', 'none');
                });
                selectedElements.current = []; 
              } else {
                alert('Please enter either <<include>> or <<extend>>.');
              }
              removeInput();
            }
          });
    
          input.focus();
        } else {
          console.error('Invalid source or target element for the link.');
        }
      } else {
        alert('Please select two elements to connect with a Broken Arrow.');
      }
    };

    const addSolidLine = () => {
      if (selectedElements.current.length === 2) {
        const sourceElement = graph.getCell(selectedElements.current[0].id); 
        const targetElement = graph.getCell(selectedElements.current[1].id); 
    
        if (sourceElement && targetElement) {
          const link = new joint.shapes.standard.Link({
            type: 'Relationship', 
            attrs: {
              line: {
                stroke: '#001F3F', 
                strokeWidth: 2,  
                targetMarker: {
                  'type': 'none'
                }
              },
            },
            label: 'association'
          });

          link.source({ id: sourceElement.id });
          link.target({ id: targetElement.id });
          link.addTo(graph);

          selectedElements.current.forEach(selected => {
            selected.element.attr('body/stroke', 'none');
          });
          
          selectedElements.current = []; 
        } else {
          console.error('Invalid source or target element for the link.');
        }
      } else {
        alert('Please select two elements to connect with a solid arrow.');
      }
    };

    const TextElement = joint.dia.Element.define('Relationship Label', {
      size: { width: 100, height: 30 },
      attrs: {
        label: {
          'font-size': 14,
          'text-anchor': 'middle',
          'ref-x': 0.5,
          'ref-y': 0.5,
          'y-alignment': 'middle',
          fill: 'black'
        }
      },
      markup: [{
        tagName: 'text',
        selector: 'label'
      }]
    });

    const deleteSelectedElements = () => {
      const remainingElements = selectedElements.current.filter(({ id }) => {
        const element = graph.getCell(id);
          if (element) {
              element.remove();
              return false;
          }
          return true;
      });
      selectedElements.current = remainingElements;
    };

    paper.on('element:pointerdblclick', (elementView) => {
      if (isToolbarReady && toolbarRef.current) {
          const element = elementView.model;
  
          // Check for the label attribute depending on the element type
          const currentLabel = element.attr('label/text') || element.attr('.label/text') || '';
  
          const input = document.createElement('input');
          input.type = 'text';
          input.value = currentLabel;
          input.style.position = 'absolute';
          input.style.width = '200px';
          input.style.left = `${element.position().x + 98}px`;
          input.style.transform = 'translateX(-50%)';
          input.style.bottom = `${window.innerHeight - toolbarRef.current.offsetTop - 55}px`;
  
          input.style.backgroundColor = '#ffff';
          input.style.border = '1px solid #001F3F';
          input.style.padding = '5px';
          input.style.borderRadius = '5px';
          input.style.fontSize = '12px';
  
          document.body.appendChild(input);
  
          const removeInput = () => {
              if (input.parentNode) {
                  document.body.removeChild(input);
              }
          };
  
          input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                  // Update the appropriate label attribute
                  if (element.attr('label/text') !== undefined) {
                      element.attr('label/text', input.value);
                  } else if (element.attr('.label/text') !== undefined) {
                      element.attr('.label/text', input.value);
                  }
                  removeInput();
              }
          });
  
          input.focus();
      }
  });

    paper.on('element:pointerclick', (elementView) => {
      const element = elementView.model;
      const isSelected = selectedElements.current.some(({ id }) => id === element.id);

      if (isSelected) {
        selectedElements.current = selectedElements.current.filter(({ id }) => id !== element.id);
        element.attr('body/stroke', 'none');
      } else {
        selectedElements.current.push({ id: element.id, element });
        element.attr('body/stroke', '#001F3F');
      }
    });

    const toolbar = document.getElementById('toolbar');
    toolbar.querySelector('.add-use-case').addEventListener('click', addUseCase);
    toolbar.querySelector('.add-actor').addEventListener('click', addActor);
    toolbar.querySelector('.add-barrow').addEventListener('click', addBrokenArrow);
    toolbar.querySelector('.add-sline').addEventListener('click', addSolidLine);
    toolbar.querySelector('.delete').addEventListener('click', deleteSelectedElements); 


    setIsToolbarReady(true);
  }, [isToolbarReady]);

  return (
    <div>
      <div id="toolbar" ref={toolbarRef}>
        <button className="buttona add-use-case">Add Use Case</button>
        <button className="buttona add-actor">Add Actor</button>
        <button className="buttona add-barrow">Broken Arrow</button>
        <button className="buttona add-sline">Association Line</button>
        <button className="buttona delete">Delete</button>
      </div>
      <div id="maonajudniboss" className='editor' ref={diagramRef}>
        <div className='system-name-container'>
          <input
            id="systemName"
            type="text"
            value={SystemName}
            onChange={(e) => setSystemName(e.target.value)}
            placeholder="Enter system name"
            className="system-name-input"
          />
          </div>
      </div>
      <button className='gbutton' onClick={handleGenerateButtonClick}>Generate</button>
    </div>
  );
};

export default DiagramEditor;