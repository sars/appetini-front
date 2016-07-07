const reviewOrderItem = (orderItem, checked, user, client) => {
  return checked
    ? client.post('/reviewed_order_items', {data: {resource: {order_item_id: orderItem.id, user_id: user.id}}})
    : client.del(`/reviewed_order_items/${orderItem.reviewed_order_item.id}`);
};

export default reviewOrderItem;
