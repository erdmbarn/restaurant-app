export interface User { userId: string; email: string; fullName: string; role: "CUSTOMER" | "RESTAURANT"; token: string; }
export interface MenuItem { id: string; name: string; description: string; price: number; category: string; available: boolean; }
export interface Menu { id: string; date: string; items: MenuItem[]; active: boolean; createdAt: string; }
export interface OrderItem { menuItemId: string; name: string; price: number; quantity: number; subtotal: number; }
export interface RefundItem { menuItemId: string; quantity: number; }
export type OrderStatus = "IN_PROGRESS" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED" | "REFUND_REQUESTED" | "REFUNDED";
export interface Order { id: string; userId: string; menuId: string; items: OrderItem[]; status: OrderStatus; totalPrice: number; discountApplied?: number; refundReason?: string; refundItems?: RefundItem[]; createdAt: string; updatedAt?: string; }
export interface ApiResponse<T> { success: boolean; message: string | null; data: T; timestamp: string; }
