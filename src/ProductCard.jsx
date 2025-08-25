import React from 'react';

export default function ProductCard({ imageSrc, name, price, onBuy }) {
    return (
        <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition p-4">
            <img src={imageSrc} alt={name} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-gray-700 mb-2">${price}</p>
            <button onClick={onBuy} className="bg-yellow-500 text-white py-1 px-3 rounded">
                Buy Now
            </button>
        </div>
    );
}