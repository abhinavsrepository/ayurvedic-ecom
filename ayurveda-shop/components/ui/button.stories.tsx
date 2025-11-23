import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Plus, Trash2, Edit, Download } from 'lucide-react';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancel',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Edit className="w-4 h-4" />,
  },
};

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
        Loading...
      </>
    ),
  },
};

export const AdminActions: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button className="bg-green-600 hover:bg-green-700">
        <Plus className="w-4 h-4 mr-2" />
        Create
      </Button>
      <Button variant="outline">
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </Button>
      <Button variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      <Button variant="destructive">
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  ),
};
