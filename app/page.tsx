import { getPurchaseHistory } from '@/actions/purchaseHistory'
import Sidebar from '@/components/Sidebar'
import React from 'react'

export default async function page() {

    
  return (
    <div className='container mx-auto'>
      
      {<Sidebar />}
    </div>
  )
}
