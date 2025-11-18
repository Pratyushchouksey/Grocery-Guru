import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const {products} = useAppContext();
  return (
    <div className='mt-16'>
        <p className='text-2xl md:text-3xl font-medium'>Best Seller</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
          {products.filter((products)=> products.inStock).slice(0,5).map((products, index)=> (
              <ProductCard key={index} product={products}/>
          ))}
          
        </div>
    </div>
  )
}

export default BestSeller
