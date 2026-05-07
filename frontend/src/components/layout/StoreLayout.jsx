import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import { Toaster } from 'react-hot-toast'

export default function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Jost, sans-serif',
            fontSize: '13px',
            letterSpacing: '0.05em',
          },
        }}
      />
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}
