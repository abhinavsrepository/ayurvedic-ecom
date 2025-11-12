// Mock customers data
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  segment: 'vip' | 'regular' | 'new' | 'churned';
  ltv: number;
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  firstOrderDate: Date;
  lastOrderDate: Date;
  addresses: CustomerAddress[];
  tags: string[];
  createdAt: Date;
  status: 'active' | 'inactive';
}

export interface CustomerAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

const indianNames = [
  'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta', 'Vikram Singh',
  'Anjali Reddy', 'Rahul Verma', 'Pooja Desai', 'Arjun Nair', 'Kavya Iyer',
  'Sanjay Mehta', 'Divya Pillai', 'Rohan Joshi', 'Meera Menon', 'Karan Chopra',
  'Ritu Agarwal', 'Nikhil Rao', 'Shreya Kapoor', 'Aditya Mishra', 'Neha Pandey',
  'Manish Shah', 'Swati Kulkarni', 'Deepak Malhotra', 'Simran Kaur', 'Vishal Yadav',
  'Ananya Bhatt', 'Suresh Rajan', 'Tanya Sinha', 'Gaurav Dubey', 'Priyanka Naik',
];

const indianCities = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
];

const customerTags = [
  'High Value',
  'Repeat Buyer',
  'Immunity Products',
  'Hair Care',
  'Skin Care',
  'Subscription',
  'Bulk Buyer',
  'Gift Buyer',
  'Seasonal',
  'Corporate',
];

export function generateMockCustomers(count: number = 100): Customer[] {
  const customers: Customer[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const name = indianNames[i % indianNames.length] + (i >= indianNames.length ? ` ${Math.floor(i / indianNames.length)}` : '');
    const location = indianCities[Math.floor(Math.random() * indianCities.length)];

    const firstOrderDate = new Date(now - Math.random() * 730 * 24 * 60 * 60 * 1000); // Up to 2 years ago
    const lastOrderDate = new Date(firstOrderDate.getTime() + Math.random() * (now - firstOrderDate.getTime()));

    const totalOrders = Math.floor(Math.random() * 50) + 1;
    const totalSpent = Math.floor(Math.random() * 50000) + 500;
    const avgOrderValue = totalSpent / totalOrders;

    const daysSinceLastOrder = (now - lastOrderDate.getTime()) / (24 * 60 * 60 * 1000);
    const segment: Customer['segment'] =
      daysSinceLastOrder > 180 ? 'churned' :
      daysSinceLastOrder < 30 && totalOrders === 1 ? 'new' :
      totalSpent > 20000 ? 'vip' : 'regular';

    const numTags = Math.floor(Math.random() * 4);
    const tags: string[] = [];
    for (let j = 0; j < numTags; j++) {
      const tag = customerTags[Math.floor(Math.random() * customerTags.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    customers.push({
      id: `CUST-${String(i + 1).padStart(4, '0')}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      segment,
      ltv: totalSpent,
      totalOrders,
      totalSpent,
      avgOrderValue,
      firstOrderDate,
      lastOrderDate,
      addresses: generateAddresses(name, location),
      tags,
      createdAt: firstOrderDate,
      status: segment === 'churned' && Math.random() > 0.5 ? 'inactive' : 'active',
    });
  }

  return customers.sort((a, b) => b.ltv - a.ltv);
}

function generateAddresses(name: string, defaultLocation: typeof indianCities[0]): CustomerAddress[] {
  const addresses: CustomerAddress[] = [];
  const numAddresses = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numAddresses; i++) {
    const location = i === 0 ? defaultLocation : indianCities[Math.floor(Math.random() * indianCities.length)];
    const type: CustomerAddress['type'] = i === 0 ? 'home' : i === 1 ? 'work' : 'other';

    addresses.push({
      id: `ADDR-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      type,
      isDefault: i === 0,
      name,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      addressLine1: `${Math.floor(Math.random() * 500) + 1}, ${['MG Road', 'Brigade Road', 'Residency Road', 'Commercial Street', 'Main Street'][Math.floor(Math.random() * 5)]}`,
      addressLine2: Math.random() > 0.5 ? `Near ${['Metro Station', 'Bus Stop', 'Mall', 'Temple', 'Park'][Math.floor(Math.random() * 5)]}` : undefined,
      city: location.city,
      state: location.state,
      pincode: String(Math.floor(Math.random() * 900000) + 100000),
    });
  }

  return addresses;
}

// TODO: replace with Spring-Boot call /api/customers
export function getMockCustomers(): Customer[] {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('ayurveda_customers');
    if (cached) {
      return JSON.parse(cached, (key, value) => {
        if (key === 'createdAt' || key === 'firstOrderDate' || key === 'lastOrderDate') {
          return new Date(value);
        }
        return value;
      });
    }
  }

  const customers = generateMockCustomers(100);
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayurveda_customers', JSON.stringify(customers));
  }
  return customers;
}

export function saveMockCustomers(customers: Customer[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayurveda_customers', JSON.stringify(customers));
  }
}
