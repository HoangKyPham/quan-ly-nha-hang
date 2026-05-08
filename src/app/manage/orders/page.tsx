import OrderTable from "@/app/manage/orders/order-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Suspense } from "react";

// order.service.tsx — data transform
// Nhận mảng phẳng orderList từ API
// Nhào nặn thành cấu trúc phù hợp UI

// order-table.tsx — điều phối
// Fetch data từ API
// Gọi useOrderService để có data đã transform
// Quản lý state: pagination, filter, sort, socket
// Cung cấp context cho các component con
// Render layout tổng thể

// order-statics.tsx, order-table-columns.tsx, order-guest-detail.tsx — UI 
// Nhận data đã sẵn sàng qua props hoặc context
// Chỉ lo render và xử lý tương tác người dùng
// Không tự fetch, không tự tính toán phức tạp

export default function AccountsPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Đơn hàng</CardTitle>
            <CardDescription>Quản lý đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <OrderTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
