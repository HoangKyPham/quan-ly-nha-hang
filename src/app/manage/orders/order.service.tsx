import {
  OrderObjectByGuestID,
  ServingGuestByTableNumber,
  Statics,
} from "@/app/manage/orders/order-table";
import { OrderStatus } from "@/constants/type";
import { GetOrdersResType } from "@/schemaValidations/order.schema";
import { useMemo } from "react";

// data transform (xu ly du lieu)
export const useOrderService = (orderList: GetOrdersResType["data"]) => {
  const result = useMemo(() => {
    //statics la du lieu tong hop quan tri tong quan.
    const statics: Statics = {
      status: {
        Pending: 0,
        Processing: 0,
        Delivered: 0,
        Paid: 0,
        Rejected: 0,
      },
      table: {},
    };
    const orderObjectByGuestId: OrderObjectByGuestID = {};
    const guestByTableNumber: ServingGuestByTableNumber = {};
    orderList.forEach((order) => {
      statics.status[order.status] = statics.status[order.status] + 1;
      // Nếu table và guest chưa bị xóa
      if (order.tableNumber !== null && order.guestId !== null) {
        if (!statics.table[order.tableNumber]) {
          statics.table[order.tableNumber] = {};
        }
        statics.table[order.tableNumber][order.guestId] = {
          ...statics.table[order.tableNumber]?.[order.guestId],
          [order.status]:
            (statics.table[order.tableNumber]?.[order.guestId]?.[
              order.status
            ] ?? 0) + 1,
        };
      }

      // Tính toán cho orderObjectByGuestId
      if (order.guestId) {
        if (!orderObjectByGuestId[order.guestId]) {
          orderObjectByGuestId[order.guestId] = [];
        }
        orderObjectByGuestId[order.guestId].push(order);
      }

      // Tính toán cho guestByTableNumber
      if (order.tableNumber && order.guestId) {
        if (!guestByTableNumber[order.tableNumber]) {
          guestByTableNumber[order.tableNumber] = {};
        }
        guestByTableNumber[order.tableNumber][order.guestId] =
          orderObjectByGuestId[order.guestId];
      }
    });

    // Duyệt từng bàn
    // Trong mỗi bàn, giữ lại guest nào còn order Pending | Processing | Delivered
    // Nếu bàn không còn guest nào như vậy thì loại luôn cả bàn
    const servingGuestByTableNumber: ServingGuestByTableNumber = {};
    for (const tableNumber in guestByTableNumber) {
      const guestObject = guestByTableNumber[tableNumber];
      const servingGuestObject: OrderObjectByGuestID = {};
      for (const guestId in guestObject) {
        const guestOrders = guestObject[guestId];
        const isServingGuest = guestOrders.some((order) =>
          [
            OrderStatus.Pending,
            OrderStatus.Processing,
            OrderStatus.Delivered,
          ].includes(order.status as any),
        );
        if (isServingGuest) {
          servingGuestObject[Number(guestId)] = guestOrders;
        }
      }
      if (Object.keys(servingGuestObject).length) {
        servingGuestByTableNumber[Number(tableNumber)] = servingGuestObject;
      }
    }
    return {
      statics,
      orderObjectByGuestId,
      servingGuestByTableNumber,
    };
  }, [orderList]);
  return result;
};
