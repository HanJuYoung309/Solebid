import React from 'react';
import type { CartListProps } from '../types/CartListProps';
import CartItem from './CartItem';

const CartList: React.FC<CartListProps> = ({ items, isEditing, onRemoveItem }) => {
    return (
        <div className='px-4 py-4 space-y-4'>
            {items.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                    isEditing={isEditing}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </div>
    )
}

export default CartList;