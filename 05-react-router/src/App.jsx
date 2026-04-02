import { Route, Routes } from "react-router";
import "./App.css";

import Sobre from "./pages/Sobre";
import Home from "./pages/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <>
      <Header />

      <div className="containerApp">
        <Routes>
          {/* Identifica todas as rotas do sistema */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />{" "}
          {/* uma rota do sistema */}
        </Routes>
      </div>

      <Footer
        link={"https://github.com/ProfCastello"}
        escritoLink={"ProfCastello"}
      />
    </>
  );
}

export default App;
