import "./App.css";
import Link from "./components/Link/Link";
import Perfil from "./components/Perfil/Perfil";
import Rodape from "./components/Rodape/Rodape";
import SocialLink from "./components/SocialLink/SocialLink";
import Switch from "./components/Switch/Switch";

function App() {
  return (
    <div id="App">
      <Perfil fotoPerfil={"https://placehold.co/100"}>Gustavo Castello</Perfil>

      <Switch />

      <div id="Link">
        <ul>
          <Link url={""}>Inscreva-se</Link>
          <Link url={""}>Minha playlist</Link>
          <Link url={""}>Me pague um café!</Link>
          <Link url={""}>Conheça o Curso DEV</Link>
        </ul>
      </div>

      <div id="SocialLinks">
        <SocialLink url={"https://github.com"} icon={"logo-github"} />
        <SocialLink url={"https://instagram.com"} icon={"logo-instagram"} />
        <SocialLink url={"https://youtube.com"} icon={"logo-youtube"} />
        <SocialLink url={"https://br.linkedin.com/"} icon={"logo-linkedin"} />
      </div>
      <Rodape>ProfCastello</Rodape>
    </div>
  );
}

export default App;
