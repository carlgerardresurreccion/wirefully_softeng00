import React, { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import '../CSS/DiagramEditor.css';

const DiagramEditor = ({onGenerate}) => {
  const diagramRef = useRef(null);
  const selectedElements = useRef([]);
  const graphRef = useRef(new joint.dia.Graph());
  const paperRef = useRef(null);

  const toolbarRef = useRef(null);
  const [isToolbarReady, setIsToolbarReady] = useState(false);

  useEffect(() => {
    const graph = new joint.dia.Graph();
    graphRef.current = graph;

    const paper = new joint.dia.Paper({
      el: diagramRef.current,
      model: graph,
      width: 600,
      height: 530,
      gridSize: 10,
      drawGrid: true,
      interactive: true
    });

    paperRef.current = paper;

    const addUseCase = () => {
      const rect = new joint.shapes.standard.Rectangle({
        position: { x: 100, y: 100 },
        size: { width: 120, height: 40 },
        attrs: {
          body: { fill: 'lightblue', stroke: 'none' },
          label: { text: 'New Use Case', fill: 'black' }
        },
        type: 'usecase' 
      });
      rect.addTo(graph);  
    };

    const addActor = () => {
      const ellipse = new joint.shapes.standard.Ellipse({
        position: { x: 300, y: 100 },
        size: { width: 80, height: 40 },
        attrs: {
          body: { fill: 'lightgreen', stroke: 'none' },
          label: { text: 'Actor', fill: 'black' }
        },
        type: 'actor'
      });
    
      ellipse.addTo(graph);  
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
                      stroke: 'blue',
                      strokeWidth: 2,
                      strokeDasharray: '5,5',
                      targetMarker: {
                        type: 'path',
                        d: 'M 10 -5 0 0 10 5 Z',
                        fill: 'blue',
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
                stroke: 'green', 
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
      console.log("Deleting selected elements:", selectedElements.current);

      selectedElements.current.forEach(({ id }) => {
        const element = graph.getCell(id); 
        if (element) {
          console.log("Removing element:", element);
          element.remove(); 
        } else {
          console.error("Element not found for deletion:", id);
        }
      });
    };

    paper.on('element:pointerdblclick', (elementView) => {
      if (isToolbarReady && toolbarRef.current) {
        const element = elementView.model;
        const currentLabel = element.attr('label/text') || '';

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
            element.attr('label/text', input.value);
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
        element.attr('body/stroke', 'red'); 
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

  const handleGenerateClick = () => {
    const diagramData = graphRef.current.toJSON(); 
    console.log("Diagram Data: ", diagramData);
  };

  return (
    <div>
      <div id="toolbar" ref={toolbarRef}>
        <button className="button add-use-case">Add Use Case</button>
        <button className="button add-actor">Add Actor</button>
        <button className="button add-barrow">Broken Arrow</button>
        <button className="button add-sline">Association Line</button>
        <button className="button delete">Delete</button>
      </div>
      <div className='editor' ref={diagramRef}></div>
      <button className='button' onClick={handleGenerateClick}>Generate</button>
    </div>
  );
};

export default DiagramEditor;