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
    firstOrderDate: new Date('2024-01-15'),
    lastOrderDate: new Date('2024-12-15'),
    addresses: [
      {
        id: 'addr-1',
        type: 'Home',
        name: 'John Doe',
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        phone: '+1234567890',
        isDefault: true,
      },
    ],
    tags: ['vip', 'frequent', 'early-adopter'],
  },
];

export const getMockCustomers = () => mockCustomers;

export const getCustomerById = (id: string) => {
  return mockCustomers.find(c => c.id === id) || null;
};

