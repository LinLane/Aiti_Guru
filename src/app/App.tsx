import { BrowserRouter, Routes, Route } from 'react-router';

import AuthPage from '../pages/auth/ui/AuthPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="auth" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
