import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import FinalCTA from './components/FinalCTA/FinalCTA.jsx';
import Footer from './components/Footer/Footer.jsx';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <Home />
      <FinalCTA />
      <Footer />
    </MotionConfig>
  );
}
