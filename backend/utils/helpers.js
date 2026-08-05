export const getEstimatedDelivery = () => {
  const today = new Date();
  const deliveryStart = new Date(today);
  const deliveryEnd = new Date(today);
  deliveryStart.setDate(today.getDate() + 3);
  deliveryEnd.setDate(today.getDate() + 5);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[deliveryStart.getMonth()]} ${deliveryStart.getDate()}–${deliveryEnd.getDate()}, ${deliveryEnd.getFullYear()}`;
};