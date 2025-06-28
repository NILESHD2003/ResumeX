import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { IdentificationCard } from "@phosphor-icons/react"

const splitIntoColumns = (items) => {
  const middle = Math.ceil(items.length / 2);
  return [items.slice(0, middle), items.slice(middle)];
};

const flattenColumns = (columns) => columns.flat();

const LayoutEditor = ({resumeMetadata, setResumeMetadata}) => {
  const [layout, setLayout] = useState(resumeMetadata?.layout?.columns || "one");
  const [headerPosition, setHeaderPosition] = useState(resumeMetadata?.layout?.headerPosition || "top");
  const [sections, setSections] = useState(resumeMetadata?.layout?.sectionArrangement);
  const [activeId, setActiveId] = useState(null);
  const [leftSections, setLeftSections] = useState([]);
  const [rightSections, setRightSections] = useState([]);


  const sensors = useSensors(useSensor(PointerSensor));

  const isTwoColumn = layout === "two";

  const items = isTwoColumn ? splitIntoColumns(sections) : sections;

  useEffect(() => {
    if (layout === "one" && resumeMetadata?.layout?.sectionArrangement?.length) {
      setSections(resumeMetadata.layout.sectionArrangement);
    }
  }, [resumeMetadata.layout.sectionArrangement]);

  useEffect(() => {
    if (layout === "two" && resumeMetadata?.layout?.twoRowSectionArrangement?.length) {
      const [left, right] = resumeMetadata.layout.twoRowSectionArrangement;
      setLeftSections(left || []);
      setRightSections(right || []);
    }
  }, []);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };


 const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    if (isTwoColumn) {
      const activeId = active.id;
      const overId = over.id;
     const isDraggingFromLeft = leftSections.includes(activeId);
      const isDroppingInLeft = leftSections.includes(overId);

      // Case 1: Dragging and dropping within the same column
      if (isDraggingFromLeft === isDroppingInLeft) {
      if (isDraggingFromLeft) { // In left column
      const oldIndex = leftSections.indexOf(activeId);
      const newIndex = leftSections.indexOf(overId);
      setLeftSections(arrayMove(leftSections, oldIndex, newIndex));
      } else { // In right column
      const oldIndex = rightSections.indexOf(activeId);
      const newIndex = rightSections.indexOf(overId);
      setRightSections(arrayMove(rightSections, oldIndex, newIndex));
      }
      } else {
      // Case 2: Dragging from one column to another
      let newLeft = [...leftSections];
      let newRight = [...rightSections];

      if (isDraggingFromLeft) { // Moving from left to right
      newLeft = newLeft.filter((id) => id !== activeId);
      const insertIndex = newRight.indexOf(overId);
      newRight.splice(insertIndex !== -1 ? insertIndex : newRight.length, 0, activeId);
      } else { // Moving from right to left
      newRight = newRight.filter((id) => id !== activeId);
      const insertIndex = newLeft.indexOf(overId);
      newLeft.splice(insertIndex !== -1 ? insertIndex : newLeft.length, 0, activeId);
      }
      setLeftSections(newLeft);
      setRightSections(newRight);
      }
    } else {
      const oldIndex = sections.indexOf(active.id);
      const newIndex = sections.indexOf(over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  useEffect(() => {
  setResumeMetadata((prev) => ({
    ...prev,
    layout: {
      ...prev.layout,
      columns: layout,
      headerPosition,
      sectionArrangement: layout === "one" ? sections : [...leftSections, ...rightSections],
      twoRowSectionArrangement: layout === "two" ? [leftSections, rightSections] : [],
    },
  }));
}, [layout, headerPosition, sections, leftSections, rightSections]);

  return (
    <div className="bg-white p-6 rounded-xl space-y-3">
      <div>
        <div className="text-lg font-semibold mb-2">Columns</div>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setLayout("one");
              setSections([...leftSections, ...rightSections]);
            }}
            className={`p-2 rounded-lg border ${layout === "one" ? "bg-blue-100 text-blue-500 font-semibold" : ""}`}
          >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 47 24" className="xssm:w-14 w-12">
            <rect width="44.971" height="4.878" x="1.011" y="0.523" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
            <rect width="44.971" height="4.878" x="1.011" y="9.339" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
            <rect width="44.971" height="4.878" x="1.011" y="18.155" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
           </svg>
          </button>
          <button
            onClick={() => {
              setLayout("two");
              if (resumeMetadata.layout.twoRowSectionArrangement?.length === 2) {
                const [left, right] = resumeMetadata.layout.twoRowSectionArrangement;
                setLeftSections(left || []);
                setRightSections(right || []);
              } else {
                // fallback if empty
                const allSections = resumeMetadata.layout.sectionArrangement || [];
                const mid = Math.ceil(allSections.length / 2);
                setLeftSections(allSections.slice(0, mid));
                setRightSections(allSections.slice(mid));
              }
            }}
            className={`p-2 rounded-lg border ${layout === "two" ? "bg-blue-100 text-blue-500 font-semibold" : ""}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 47 24" className="xssm:w-14 w-12">
              <rect width="20.671" height="4.878" x="0.853" y="0.841" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
              <rect width="20.671" height="4.878" x="0.853" y="9.339" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
              <rect width="20.671" height="4.878" x="0.853" y="17.838" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
              <rect width="20.671" height="4.878" x="25.476" y="0.84" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
              <rect width="20.671" height="4.878" x="25.476" y="9.339" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
              <rect width="20.671" height="4.878" x="25.476" y="17.838" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
            </svg>
          </button>
        </div>
      </div>
      <div>
        {layout === "two" && 
        <>
        <div className="text-lg font-semibold mb-2">Header Position</div>
          <div className="flex space-x-4">
            {/* Top */}
            <button
              onClick={() => setHeaderPosition("top")}
              className={`rounded-lg ${
                headerPosition === "top" ? "bg-blue-100 text-blue-500 font-semibold" : ""
              }`}
            >
              <div className={`w-16 h-16 overflow-hidden rounded ${
                  headerPosition === "top" ? "bg-blue-100" : "bg-gray-200"
                }`}>
                <div className={`w-full h-8 ${
                    headerPosition === "top" ? "bg-blue-500" : "bg-black"
                  }`}></div>
              </div>
            </button>
  
            {/* Left */}
            <button
              onClick={() => setHeaderPosition("left")}
              className={`rounded-lg ${
                headerPosition === "left" ? "bg-blue-100 text-blue-500 font-semibold" : ""
              }`}
            >
              <div className={`w-16 h-16 overflow-hidden rounded flex  ${
                  headerPosition === "left" ? "bg-blue-100" : "bg-gray-200"
                }`}>
                <div className={`w-8 h-full ${
                    headerPosition === "left" ? "bg-blue-500" : "bg-black"
                  }`}></div>
              </div>
            </button>
  
            {/* Right */}
            <button
              onClick={() => setHeaderPosition("right")}
              className={`rounded-lg  ${
                headerPosition === "right" ? "bg-blue-100 text-blue-500 font-semibold" : ""
              }`}
            >
              <div className={`w-16 h-16 overflow-hidden rounded flex justify-end ${
                  headerPosition === "right" ? "bg-blue-100" : "bg-gray-200"
                }`}>
                <div className={`w-8 h-full ${
                    headerPosition === "right" ? "bg-blue-500" : "bg-black"
                  }`}></div>
              </div>
            </button>
          </div>
        </>
        }
        </div>

      <div>
        <div className="text-lg font-semibold mb-2">Rearrange Sections</div>
          <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {isTwoColumn ? (
            <div className="grid grid-cols-2 gap-4">
              {headerPosition === "top" &&
                    <div className="bg-gray-200 w-full h-20 col-span-2 rounded flex justify-center items-center">
                      <IdentificationCard size={32} weight="fill" />
                    </div>
              }
              {[leftSections, rightSections].map((columnItems, idx) => (
                <SortableContext key={idx} items={columnItems} strategy={verticalListSortingStrategy}>    
                  <div className="p-4 rounded min-h-[100px]">
                    {headerPosition === "right" && idx === 1 &&
                      <div>
                        <div className="col-span-1"></div>
                        <div className="bg-gray-200 w-full h-20 col-span-1 rounded flex justify-center items-center">
                          <IdentificationCard size={32} weight="fill" />
                        </div>
                      </div>
                    }
                    {headerPosition === "left" && idx === 0 &&
                          <div className="bg-gray-200 w-full h-20 col-span-1 rounded flex justify-center items-center">
                            <IdentificationCard size={32} weight="fill" />
                          </div>
                    }
                    {columnItems.map((id) => (
                      <SortableItem key={id} id={id} />
                    ))}
                  </div>
                </SortableContext>
              ))}
            </div>
          ) : (
            <SortableContext
              items={sections}
              strategy={verticalListSortingStrategy}
            >
              <div className="bg-gray-200 w-full h-20 rounded flex justify-center items-center">
                <IdentificationCard size={32} weight="fill" />
              </div>
              <div className="p-4 rounded">
                {sections.map((id) => (
                  <SortableItem key={id} id={id} />
                ))}
              </div>
            </SortableContext>
          )}

          <DragOverlay>
            {activeId ? (
              <div className="bg-white rounded-md shadow px-3 py-2 font-medium border border-gray-200">
                {activeId}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
    );
};

export default LayoutEditor;
