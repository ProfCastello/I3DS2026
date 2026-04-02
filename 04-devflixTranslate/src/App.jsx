import { useCallback, useEffect, useState } from "react";
import "./App.css";

import logo from "./assets/devflix.png";
import lupa from "./assets/search.svg";

import Rodape from "./components/Rodape/Rodape";
import MovieCard from "./components/MovieCard/MovieCard";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import {
  LANGUAGES,
  TRANSLATIONS,
  THEME_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
} from "./i18n/i18n";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const hasSavedLanguage = LANGUAGES.some(
      (languageItem) => languageItem.code === savedLanguage,
    );

    return hasSavedLanguage ? savedLanguage : "pt-BR";
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  //Utilizando uma CHAVE de API do arquivo .env
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  const apiUrl = `https://omdbapi.com/?apikey=${apiKey}`;

  //Criando a conexão com a API e trazendo informações
  const searchMovies = useCallback(
    async (title) => {
      const response = await fetch(`${apiUrl}&s=${title}`);
      const data = await response.json();

      //Alimentando a variavel movies
      setMovies(data.Search);
    },
    [apiUrl],
  );

  useEffect(() => {
    (async () => {
      await searchMovies("Hulk"); // termo para pesquina ao carregar o site
    })();
  }, [searchMovies]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const t = TRANSLATIONS[language];
  const isDarkTheme = theme === "dark";

  const translateMovieType = (type) => {
    const typeMap = {
      movie: t.mediaTypeMovie,
      series: t.mediaTypeSeries,
      episode: t.mediaTypeEpisode,
    };

    return typeMap[type?.toLowerCase()] || type;
  };

  return (
    <div id="App">
      {/* NAVBAR MOBILE */}
      <nav className="navbar-mobile">
        <img src={logo} alt={t.logoAlt} className="navbar-logo" />
        <button
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* MENU DRAWER - APENAS MOBILE */}
      {menuOpen && (
        <div className="menu-drawer">
          <div className="menu-section">
            <h3>{t.language || "Idioma"}</h3>
            <div className="language-options">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`menu-item ${language === lang.code ? "active" : ""}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setMenuOpen(false);
                  }}
                >
                  <span
                    className="flag-inline"
                    style={{
                      backgroundImage: `url(https://flagcdn.com/w320/${lang.flagCode}.png)`,
                    }}
                  ></span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="menu-divider"></div>

          <div className="menu-section">
            <h3>{t.theme || "Tema"}</h3>
            <button
              className="theme-menu-item"
              onClick={() => {
                setTheme(isDarkTheme ? "light" : "dark");
                setMenuOpen(false);
              }}
            >
              <span className="theme-icon">{isDarkTheme ? "☀️" : "🌙"}</span>
              <span>{isDarkTheme ? "Modo Claro" : "Modo Escuro"}</span>
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP: Language Selector e Theme Button */}
      <div className="desktop-only">
        <LanguageSelector
          languages={LANGUAGES}
          selectedLanguage={language}
          onLanguageChange={setLanguage}
          ariaLabel={t.languageAria}
        />
      </div>

      <button
        className="themeToggle desktop-only"
        onClick={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
        aria-label={isDarkTheme ? "Ativar tema claro" : "Ativar tema escuro"}
        title={isDarkTheme ? "Tema claro" : "Tema escuro"}
      >
        {isDarkTheme ? "☀️" : "🌙"}
      </button>

      <img id="Logo" src={logo} alt={t.logoAlt} />

      <div className="search">
        <input
          onKeyDown={(e) => e.key === "Enter" && searchMovies(search)}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder={t.searchPlaceholder}
        />
        <img
          onClick={() => searchMovies(search)}
          src={lupa}
          alt={t.searchButtonAlt}
        />
      </div>

      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie, index) => (
            <MovieCard
              key={index}
              {...movie}
              apiUrl={apiUrl}
              typeLabel={translateMovieType(movie.Type)}
              uiText={t}
              language={language}
            />
          ))}
        </div>
      ) : (
        <h2 className="empty">{t.emptyMovieList}</h2>
      )}

      <Rodape
        link={"https://github.com/ProfCastello"}
        prefixText={t.footerPrefix}
      >
        ProfCastello
      </Rodape>
    </div>
  );
};

export default App;
