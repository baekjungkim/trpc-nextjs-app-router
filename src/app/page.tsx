import { serverClient } from '@/app/_trpc/server';

import TodoList from '@/app/_components/TodoList';

export default async function Home() {
  const todos = await serverClient.getTodos();
  return (
    <main className="max-w-3xl mx-auto mt-5">
      <TodoList initTodos={todos} />
    </main>
  );
}
