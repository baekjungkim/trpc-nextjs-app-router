'use client';

import { trpc } from '@/app/_trpc/client';
import { serverClient } from '@/app/_trpc/server';
import { useState } from 'react';

export default function TodoList({
  initTodos,
}: {
  initTodos: Awaited<ReturnType<(typeof serverClient)['getTodos']>>;
}) {
  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const [content, setContent] = useState('');

  return (
    <div>
      <div className='="text-white my-5 text-3xl'>
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className="flex gap-3 items-center">
            <input
              id={`check-${todo.id}`}
              type="checkbox"
              checked={!!todo.done}
              style={{ zoom: 1.5 }}
              onChange={async () => {
                setDone.mutate({
                  id: todo.id,
                  done: todo.done ? 0 : 1,
                });
              }}
            />
            <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
          </div>
        ))}
      </div>
      <div className="flex gap-3 items-center">
        <label htmlFor="content">Content</label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-black flex-grow bg-white rounded-md border-gray-300 shadow-sm focus:ring-blue-500 py-2 px-4"
        />
        <button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate(content);
              setContent('');
            }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
