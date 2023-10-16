import React from 'react'
import LatestPosts from '../components/LatestPosts'
import MainLayout from '../layouts/MainLayout'

export default function Home() {
  return (
    <MainLayout>
        <LatestPosts/>
    </MainLayout>
  )
}
