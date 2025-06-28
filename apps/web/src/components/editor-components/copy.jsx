import React, { useState } from "react";
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

const initialFlatSections = [
  "Profile",
  "Education",
  "Certificates",
  "Skills",
  "Professional Experience",
  "Languages",
  "Projects",
  "Awards",
  "Courses",
  "References",
  "Declaration",
];

const splitIntoColumns = (items) => {
  const middle = Math.ceil(items.length / 2);
  return [items.slice(0, middle), items.slice(middle)];
};

const flattenColumns = (columns) => columns.flat();

const LayoutEditor = () => {
  const [sections, setSections] = useState(initialFlatSections);
  const [activeId, setActiveId] = useState(null);
  const [layout, setLayout] = useState("one"); // 'one' or 'two'
  const [headerPosition, setHeaderPosition] = useState("top")


  const sensors = useSensors(useSensor(PointerSensor));

  const isTwoColumn = layout === "two";

  const items = isTwoColumn ? splitIntoColumns(sections) : sections;

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
      const [left, right] = splitIntoColumns(sections);
      const leftIndex = left.indexOf(active.id);
      const rightIndex = right.indexOf(active.id);
      const from = leftIndex !== -1 ? left : right;
      const to = left.includes(over.id) ? left : right;

      if (from === to) {
        const newItems = arrayMove(from, from.indexOf(active.id), to.indexOf(over.id));
        const updated = from === left ? [newItems, right] : [left, newItems];
        setSections(flattenColumns(updated));
      } else {
        from.splice(from.indexOf(active.id), 1);
        to.splice(to.indexOf(over.id), 0, active.id);
        setSections(flattenColumns([left, right]));
      }
    } else {
      const oldIndex = sections.indexOf(active.id);
      const newIndex = sections.indexOf(over.id);
      setSections(arrayMove(sections, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl space-y-3">
      <div>
        <div className="text-lg font-semibold mb-2">Columns</div>
        <div className="flex space-x-4">
          <button
            onClick={() => setLayout("one")}
            className={`p-2 rounded-lg border ${layout === "one" ? "bg-blue-100 text-blue-500 font-semibold" : ""}`}
          >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 47 24" className="xssm:w-14 w-12">
            <rect width="44.971" height="4.878" x="1.011" y="0.523" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
            <rect width="44.971" height="4.878" x="1.011" y="9.339" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
            <rect width="44.971" height="4.878" x="1.011" y="18.155" fill="currentColor" stroke="currentColor" rx="1.5"></rect>
           </svg>
          </button>
          <button
            onClick={() => setLayout("two")}
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
              {splitIntoColumns(sections).map((columnItems, columnIdx) => (
                <SortableContext
                  key={columnIdx}
                  items={columnItems}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="p-4 rounded">
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
