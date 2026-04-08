import { OrderStatus } from "../types";
const cfg: Record<OrderStatus, { label: string; color: string }> = {
  IN_PROGRESS: { label: "Siparis Alindi", color: "bg-yellow-100 text-yellow-800" },
  PREPARING: { label: "Hazirlaniyor", color: "bg-blue-100 text-blue-800" },
  ON_THE_WAY: { label: "Yolda", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "Teslim Edildi", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Iptal", color: "bg-red-100 text-red-800" },
  REFUND_REQUESTED: { label: "Iade Talebi", color: "bg-orange-100 text-orange-800" },
  REFUNDED: { label: "Iade Edildi", color: "bg-gray-100 text-gray-800" },
};
export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, color } = cfg[status] ?? { label: status, color: "bg-gray-100 text-gray-800" };
  return <span className={`badge ${color}`}>{label}</span>;
}