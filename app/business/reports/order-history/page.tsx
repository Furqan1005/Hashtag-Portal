import Link from "next/link";
import { Package, Truck, Wallet, AlertTriangle, Gem } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/business/reports/stat-card";
import { ReportsEmptyState } from "@/components/business/reports/reports-empty-state";
import { getOrderHistory, type OrderItem } from "@/lib/data/orders";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function formatDate(value: string | null) {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

export default async function OrderHistoryPage() {
  const orders = await getOrderHistory();

  const totalOrders = orders.length;
  const readyToShip = orders.filter((order) => order.status === "ready_to_ship").length;
  const withBalance = orders.filter((order) => order.balance_amount > 0).length;
  const delayed = orders.filter((order) => order.status === "delayed").length;

  const rows = orders.flatMap((order) =>
    order.order_items.map((item) => ({ order, item }))
  );

  const totals = rows.reduce(
    (acc, { item }) => {
      acc.ordered += item.ordered_qty;
      acc.finished += item.finished_qty;
      acc.exported += item.exported_qty;
      acc.balance += item.balance_qty;
      return acc;
    },
    { ordered: 0, finished: 0, exported: 0, balance: 0 }
  );

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <StatCard icon={Package} label="Total Orders" value={totalOrders} />
        <StatCard
          icon={Truck}
          label="Ready to Ship"
          value={readyToShip}
          iconBgClassName="bg-success/15"
          iconClassName="text-success"
        />
        <StatCard
          icon={Wallet}
          label="Balance"
          value={withBalance}
          iconBgClassName="bg-warning/15"
          iconClassName="text-warning"
        />
        <StatCard
          icon={AlertTriangle}
          label="Delayed"
          value={delayed}
          iconBgClassName="bg-destructive/15"
          iconClassName="text-destructive"
        />
      </div>

      {rows.length === 0 ? (
        <ReportsEmptyState icon={Package} message="No orders placed yet." />
      ) : (
        <div className="card-surface overflow-hidden rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exp Date</TableHead>
                <TableHead>PO No</TableHead>
                <TableHead>Sub PO No</TableHead>
                <TableHead>Design No</TableHead>
                <TableHead>KT/Col</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Delay Info</TableHead>
                <TableHead className="text-right">Ordered</TableHead>
                <TableHead className="text-right">Finished</TableHead>
                <TableHead className="text-right">Exported</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ order, item }: { order: typeof orders[number]; item: OrderItem }) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(order.exp_date)}</TableCell>
                  <TableCell>
                    <Link
                      href="/business/reports/order-history"
                      className="text-brand-brown font-medium underline-offset-4 hover:underline"
                    >
                      {order.po_no}
                    </Link>
                  </TableCell>
                  <TableCell>{order.sub_po_no ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Gem className="text-brand-brown/40 size-3.5" />
                      {item.design_no ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.kt_col_label ? (
                      <Badge variant="gold">{item.kt_col_label}</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{item.size ?? "—"}</TableCell>
                  <TableCell>
                    {item.delay_info ? (
                      <Badge variant="warning">{item.delay_info}</Badge>
                    ) : (
                      <Badge variant="success">On schedule</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{item.ordered_qty}</TableCell>
                  <TableCell className="text-right">{item.finished_qty}</TableCell>
                  <TableCell className="text-right">{item.exported_qty}</TableCell>
                  <TableCell className="text-right">{item.balance_qty}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell className="text-right">{totals.ordered}</TableCell>
                <TableCell className="text-right">{totals.finished}</TableCell>
                <TableCell className="text-right">{totals.exported}</TableCell>
                <TableCell className="text-right">{totals.balance}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  );
}
