export const mockOrders = [
  {
    id: '1',
    customerId: '1',
    status: 'delivered',
    total: 100,
    items: [],
    createdAt: new Date('2024-01-01'),
  },
];

export const getMockOrders = () => mockOrders;

export const getOrdersByCustomerId = (customerId: string) => {
  return mockOrders.filter(o => o.customerId === customerId);
};
