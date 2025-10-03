// import React, { useEffect, useState } from "react";
// import { ordersApi } from "./api/orders/orders";
// import type { Order } from "./api/orders/order-type";

// export const OrdersPage: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const data = await ordersApi.list();
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Orders</h1>
//       <div>
//         {orders.map(order => (
//          <div>
        
//             {order.items.map(item =>(
//              <div>
//               <img src={item.product.imageUrl} alt={item.product.name} />
//               <p>{item.product.category}</p>
//               <p>{item.product.description}</p>
//              </div>
//                 ))}
            

//          </div> 
//         ))}
//       </div>
//     </div>
//   );
// };

