import { rest } from 'msw';
import { mockProducts } from '../tests/advanced.test.tsx';

const handlers = [
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json(mockProducts));
  }),
  rest.post('/api/products', (req, res, ctx) => {
    const newProduct = req.body;
    mockProducts.push(newProduct);
    return res(ctx.status(201));
  }),
  rest.put('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    mockProducts = mockProducts.map(product => product.id === id ? updatedProduct : product);
    return res(ctx.status(200));
  }),
  rest.delete('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params;
    mockProducts = mockProducts.filter(product => product.id !== id);
    return res(ctx.status(204));
  }),
];

export { handlers };
