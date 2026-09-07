import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Explore from './pages/Explore/Explore.jsx';
import ConceptPage from './pages/Concept/ConceptPage.jsx';
import PlaygroundPage from './pages/Playground/PlaygroundPage.jsx';
import QuizPlaceholder from './pages/QuizPlaceholder.jsx';
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
            path="/concept/:slug"
            element={
              <Layout>
                <ConceptPage />
              </Layout>
            }
          />
          <Route
            path="/playground/:slug"
            element={
              <Layout>
                <PlaygroundPage />
              </Layout>
            }
          />
          <Route
            path="/quiz/:slug"
            element={
              <Layout>
                <QuizPlaceholder />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
