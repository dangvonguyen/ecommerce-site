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
import { db, users } from '@/db';
import { formatCurrency, formatNumber } from '@/lib/formatter';

import { PageHeader } from '../_components/PageHeader';

import { DeleteDropDownItem } from './_components/UserActions';

export default function AdminCustomersPage() {
  return (
    <>
      <PageHeader>Products</PageHeader>
      <CustomersTable />
    </>
  );
}

async function CustomersTable() {
  const result = await db.query.users.findMany({
    columns: { id: true, email: true },
    with: {
      orders: { columns: { pricePaidInCents: true } },
    },
    orderBy: desc(users.createdAt),
  });

  if (result.length === 0) return <p>No customers found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>
              {formatCurrency(
                user.orders.reduce((sum, o) => o.pricePaidInCents + sum, 0) /
                  100
              )}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger className="hover:cursor-pointer">
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id={user.id} />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
