"use client"
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import SortableLinks from '@/components/SortableLinks';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';
import { useSOPStore } from '@/lib/stores/useSOP';

interface Item {
  name: string;
  id: number;
}

const SortableDemo: React.FC = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = useSOPStore((state) => state.SOPItems);
  const setItems = useSOPStore((state) => state.setSOPItems);
  const name = useSOPStore((state) => state.SOPName); 
  const setName = useSOPStore((state) => state.setSOPName);                                                       
  const [newItemName, setNewItemName] = useState('');

  console.log("items", items);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
    }
  }

  function handleDelete(idToDelete: number) {
    const newItems = items.filter((item) => item.id !== idToDelete);
    setItems(newItems);
  }

  function addNewItem() {
    if (newItemName.trim() !== '') {
      const newItem: Item = { name: newItemName, id: Date.now() };
      setItems([...items, newItem]);
      setNewItemName('');
    }
  }

  return (
    <main className='max-w-2xl'>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter SOP name'
        className="w-[100%]" 
      />
      <div className='max-w-2xl flex justify-between items-center my-4'>
        <Input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Enter new item name"
          className="w-[85%]"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={addNewItem}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className='max-w-2xl space-y-4'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableLinks key={item.id} id={item} onDelete={handleDelete} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
};

export default SortableDemo;
