import { count, eq, sum } from 'drizzle-orm';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { db, orders, products, users } from '@/db';
import { formatCurrency, formatNumber } from '@/lib/formatter';

async function getSalesData() {
  const result = await db.query.orders.findFirst({
    columns: {},
    extras: {
      total: sum(orders.pricePaidInCents).mapWith(Number).as('total'),
      salesCount: count().as('sales_count'),
    }
  });

  return {
    amount: (result?.total || 0) / 100,
    numberOfSales: result?.salesCount || 0,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.$count(users),
    db
      .select({ totalCents: sum(orders.pricePaidInCents).mapWith(Number) })
      .from(orders),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData[0].totalCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.$count(products, eq(products.isAvailableForPurchase, true)),
    db.$count(products, eq(products.isAvailableForPurchase, false)),
  ]);

  return { activeCount, inactiveCount };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average Value`}
        body={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
