import { createRoot } from 'react-dom/client'
import './index.css'
import { Logo } from '@pmndrs/branding'
import { App } from './App'


function Root() {
  return (
    <>
      <App />
      <div style={{ position: 'absolute', pointerEvents: 'none', top: 0, left: 0, width: '100vw', height: '100vh' }}>
        <a href="https://pmnd.rs/" style={{ position: 'absolute', bottom: 40, left: 90, fontSize: '13px' }}>
          pmnd.rs
          <br />
          dev collective
        </a>
        <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '13px' }}>18/01/2024</div>
        <Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} />
        <a style={{ position: 'absolute', top: 40, left: 40, fontSize: '13px' }} href="#">
          scroll up/down ...
        </a>
      </div>{' '}
    </>
  )
}

createRoot(document.getElementById('root')).render(<Root />)