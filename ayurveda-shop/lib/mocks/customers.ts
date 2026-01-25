export const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    totalOrders: 5,
    totalSpent: 500,
    segment: 'vip',
    status: 'active',
    ltv: 1200,
    avgOrderValue: 240,
    createdAt: new Date('2024-01-01'),
  },
];

export const getMockCustomers = () => mockCustomers;

export const getCustomerById = (id: string) => {
  return mockCustomers.find(c => c.id === id) || null;
};
