import { http, HttpResponse } from 'msw'

let todos = [
  { id: 1, text: '테스트 할 일 1', completed: false },
  { id: 2, text: '테스트 할 일 2', completed: true },
]

export const mockApiHandlers = [
  http.get('/todos', () => {
    return HttpResponse.json(todos)
  }),

  http.post('/todos', async ({ request }) => {
    const { text } = await request.json() as { text: string }
    const newTodo = { id: todos.length + 1, text, completed: false }
    todos.push(newTodo)
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  http.put('/todos/:id', async ({ params, request }) => {
    const { id } = params
    const updates = await request.json() as Record<string, unknown>;
    todos = todos.map(todo =>
      todo.id === Number(id) ? { ...todo, ...updates } : todo
    )
    return HttpResponse.json(todos.find(todo => todo.id === Number(id)))
  }),

  http.delete('/todos/:id', ({ params }) => {
    const { id } = params
    todos = todos.filter(todo => todo.id !== Number(id))
    return new HttpResponse(null, { status: 204 })
  }),
]
