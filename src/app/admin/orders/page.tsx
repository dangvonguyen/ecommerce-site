import { desc } from 'drizzle-orm';
import { MoreVertical } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { db, orders } from '@/db';
import { formatCurrency } from '@/lib/formatter';

import { PageHeader } from '../_components/PageHeader';

import { DeleteDropDownItem } from './_components/OrderActions';

export default function AdminOrdersPage() {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <OrdersTable />
    </>
  );
}

async function OrdersTable() {
  const result = await db.query.orders.findMany({
    columns: { id: true, pricePaidInCents: true },
    with: {
      product: { columns: { name: true } },
      user: { columns: { email: true } },
    },
    orderBy: desc(orders.createdAt),
  });

  if (result.length === 0) return <p>No sales found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price Paid</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.product.name}</TableCell>
            <TableCell>{order.user.email}</TableCell>
            <TableCell>
              {formatCurrency(order.pricePaidInCents / 100)}
            </TableCell>
            <TableCell className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={order.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
