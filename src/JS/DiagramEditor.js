import React, { useEffect, useRef } from 'react';
import * as joint from 'jointjs';

const DiagramEditor = () => {
  const diagramRef = useRef(null);
  const selectedElements = useRef([]);

  useEffect(() => {
    const graph = new joint.dia.Graph();
    const paper = new joint.dia.Paper({
      el: diagramRef.current,
      model: graph,
      width: 600,
      height: 530,
      gridSize: 10,
      drawGrid: true,
      interactive: true
    });

    const addUseCase = () => {
      const rect = new joint.shapes.standard.Rectangle();
      rect.position(100, 100);
      rect.resize(120, 40);
      rect.attr({
        body: { fill: 'lightblue', stroke: 'none' },
        label: { text: 'New Use Case', fill: 'black' }
      });
      rect.addTo(graph);
    };

    const addActor = () => {
      const ellipse = new joint.shapes.standard.Ellipse();
      ellipse.position(300, 100);
      ellipse.resize(80, 40);
      ellipse.attr({
        body: { fill: 'lightgreen' },
        label: { text: 'Actor', fill: 'black' }
      });
      ellipse.addTo(graph);
    };

    const addBrokenArrow = () => {
      if (selectedElements.current.length === 2) {
        const sourceElement = graph.getCell(selectedElements.current[0].id); // Ensure the cell exists in the graph
        const targetElement = graph.getCell(selectedElements.current[1].id); // Ensure the cell exists in the graph
    
        if (sourceElement && targetElement) {
          const link = new joint.shapes.standard.Link();
          link.source({ id: sourceElement.id });
          link.target({ id: targetElement.id });
          link.attr({
            line: {
              stroke: 'blue',
              strokeWidth: 2,
              strokeDasharray: '5,5', // Creates the dashed (broken) line
              targetMarker: {
                'type': 'path',
                'd': 'M 10 -5 0 0 10 5 Z',
                'fill': 'blue'
              }
            },
            labels: [{
              position: 0.5,
              attrs: {
                text: { text: '<<Extend>>', fill: 'blue', fontSize: 12 }
              }
            }]
          });
          link.addTo(graph);

          selectedElements.current.forEach(selected => {
            selected.element.attr('body/stroke', 'none');
          });

          selectedElements.current = []; // Reset selection after creating the link
        } else {
          console.error('Invalid source or target element for the link.');
        }
      } else {
        alert('Please select two elements to connect with an Extend arrow.');
      }
    };

    const addSolidLine = () => {
      if (selectedElements.current.length === 2) {
        const sourceElement = graph.getCell(selectedElements.current[0].id); // Ensure the cell exists in the graph
        const targetElement = graph.getCell(selectedElements.current[1].id); // Ensure the cell exists in the graph
    
        if (sourceElement && targetElement) {
          const link = new joint.shapes.standard.Link();
          link.source({ id: sourceElement.id });
          link.target({ id: targetElement.id });
          link.attr({
            line: {
              stroke: 'green', // You can change the color if needed
              strokeWidth: 2,  // Solid line width
              targetMarker: {
                'type': 'none'
              }
            },
          });
          link.addTo(graph);

          selectedElements.current.forEach(selected => {
            selected.element.attr('body/stroke', 'none');
          });
          
          selectedElements.current = []; // Reset selection after creating the link
        } else {
          console.error('Invalid source or target element for the link.');
        }
      } else {
        alert('Please select two elements to connect with a solid arrow.');
      }
    };

    // Define a custom element for the pure text label with dynamic text
    const TextElement = joint.dia.Element.define('custom.TextElement', {
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

    // Function to add the label with custom text
    const addIncludeLabel = (text) => {
      const label = new TextElement({
        attrs: {
          label: {
            text: '<<include>>' // Set the custom text here
          }
        }
      });
      label.position(200, 200); // Set the position for the label
      label.addTo(graph);
    };

    const addExcludeLabel = (text) => {
      const label = new TextElement({
        attrs: {
          label: {
            text: '<<exclude>>' // Set the custom text here
          }
        }
      });
      label.position(200, 200); // Set the position for the label
      label.addTo(graph);
    };

    paper.on('element:pointerdblclick', (elementView) => {
      const element = elementView.model;
      const currentLabel = element.attr('label/text') || '';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentLabel;
      input.style.position = 'absolute';
      input.style.left = `${element.position().x}px`;
      input.style.top = `${element.position().y}px`;
      input.style.width = `${element.size().width}px`;
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
    });

    // Handle element selection
    paper.on('element:pointerclick', (elementView) => {
      const element = elementView.model;
      const selectedIndex = selectedElements.current.findIndex(selected => selected.id === element.id);
    
      if (selectedIndex > -1) {
        // If the element is already selected, unselect it
        selectedElements.current.splice(selectedIndex, 1);
        element.attr('body/stroke', 'none'); // Reset the element's stroke color
      } else if (selectedElements.current.length < 2) {
        // If the element is not selected and less than 2 elements are selected, select it
        selectedElements.current.push({
          id: element.id,
          element
        });
        element.attr('body/stroke', 'red'); // Highlight selected element
      } else {
        alert('You can only select two elements at a time.');
      }
    });

    // Toolbar buttons
    const toolbar = document.getElementById('toolbar');
    toolbar.querySelector('.add-use-case').addEventListener('click', addUseCase);
    toolbar.querySelector('.add-actor').addEventListener('click', addActor);
    toolbar.querySelector('.add-barrow').addEventListener('click', addBrokenArrow);
    toolbar.querySelector('.add-include').addEventListener('click', addIncludeLabel);
    toolbar.querySelector('.add-exclude').addEventListener('click', addExcludeLabel);
    toolbar.querySelector('.add-sline').addEventListener('click', addSolidLine);

  }, []);

  return (
    <div>
      <div id="toolbar">
        <button className="add-use-case">Add Use Case</button>
        <button className="add-actor">Add Actor</button>
        <button className="add-barrow">Broken Arrow</button>
        <button className="add-include">Add Include Label</button>
        <button className="add-exclude">Add Exclude Label</button>
        <button className="add-sline">Association Line</button>
      </div>
      <div ref={diagramRef} style={{ width: '100%', height: '600px', border: '1px solid gray' }}></div>
    </div>
  );
};

export default DiagramEditor;
