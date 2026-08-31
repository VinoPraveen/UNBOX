import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Explore from './pages/Explore/Explore.jsx';
import ConceptPlaceholder from './pages/ConceptPlaceholder/ConceptPlaceholder.jsx';
import FinalCTA from './components/FinalCTA/FinalCTA.jsx';
import Footer from './components/Footer/Footer.jsx';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
                <FinalCTA />
              </Layout>
            }
          />
          <Route
            path="/explore"
            element={
              <Layout>
                <Explore />
              </Layout>
            }
          />
          <Route
            path="/explore/:conceptId"
            element={
              <Layout>
                <ConceptPlaceholder />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
