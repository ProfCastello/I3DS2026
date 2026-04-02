import { useEffect, useState } from "react";
import styles from "./MovieDescription.module.css";

const translationCache = new Map();

const languageMap = {
  "pt-BR": "pt",
  "en-US": "en",
  "es-ES": "es",
};

const translateText = async (text, targetLanguage) => {
  if (!text || text === "N/A" || targetLanguage === "en") {
    return text;
  }

  const cacheKey = `${targetLanguage}:${text}`;
  const cached = translationCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(endpoint);
  const data = await response.json();

  const translated = data?.[0]?.map((chunk) => chunk[0]).join("") || text;
  translationCache.set(cacheKey, translated);

  return translated;
};

const formatReleaseDate = (releaseDate, localeCode) => {
  if (!releaseDate || releaseDate === "N/A") {
    return releaseDate;
  }

  const parsed = new Date(releaseDate);

  if (Number.isNaN(parsed.getTime())) {
    return releaseDate;
  }

  return new Intl.DateTimeFormat(localeCode, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const MovieDescription = (props) => {
  const [movieDesc, setMovieDesc] = useState([]);
  const [translatedFields, setTranslatedFields] = useState({
    plot: "",
    genre: "",
    actors: "",
  });
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  const t = props.uiText;
  const isLoading = isLoadingApi || isTranslating;

  // Congelar scroll quando o modal está aberto sem ocultar a barra
  useEffect(() => {
    const preventScroll = (event) => {
      event.preventDefault();
    };

    const preventScrollByKeyboard = (event) => {
      const blockedKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];

      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollByKeyboard, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollByKeyboard);
    };
  }, []);

  useEffect(() => {
    fetch(`${props.apiUrl}&i=${props.movieID}`)
      .then((response) => response.json())
      .then((data) => {
        setMovieDesc(data);
        setIsLoadingApi(false);
      })
      .catch(() => {
        setMovieDesc([]);
        setIsLoadingApi(false);
      });
  }, [props.apiUrl, props.movieID]);

  useEffect(() => {
    const targetLanguage = languageMap[props.language] || "en";

    if (!movieDesc?.Title) {
      return;
    }

    let cancelled = false;

    const runTranslations = async () => {
      if (targetLanguage === "en") {
        if (!cancelled) {
          setTranslatedFields({
            plot: movieDesc.Plot,
            genre: movieDesc.Genre,
            actors: movieDesc.Actors,
          });
          setIsTranslating(false);
        }
        return;
      }

      setIsTranslating(true);

      try {
        const [plot, genre, actors] = await Promise.all([
          translateText(movieDesc.Plot, targetLanguage),
          translateText(movieDesc.Genre, targetLanguage),
          translateText(movieDesc.Actors, targetLanguage),
        ]);

        if (!cancelled) {
          setTranslatedFields({ plot, genre, actors });
          setIsTranslating(false);
        }
      } catch {
        if (!cancelled) {
          setTranslatedFields({
            plot: movieDesc.Plot,
            genre: movieDesc.Genre,
            actors: movieDesc.Actors,
          });
          setIsTranslating(false);
        }
      }
    };

    runTranslations();

    return () => {
      cancelled = true;
    };
  }, [movieDesc, props.language]);

  return (
    <div className={styles.modalBackdrop} onClick={props.click}>
      <div className={styles.movieModal} onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Traduzindo...</p>
          </div>
        ) : (
          <>
            <div className={styles.movieInfo}>
              <img src={movieDesc.Poster} alt="" />

              <button
                className={styles.btnClose}
                onClick={props.click}
                aria-label={t.closeModal}
                title={t.closeModal}
              >
                ×
              </button>

              <div className={styles.movieType}>
                <div>
                  <img src="/favicon.png" alt="" />
                  {props.typeLabel}
                  <h1>{movieDesc.Title}</h1>
                  <a
                    href={`https://google.com/search?q=${encodeURIComponent(movieDesc.Title)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ▶️ {t.watchNow}
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.containerMisc}>
              <div className={styles.containerFlex}>
                {t.rating}: {movieDesc.imdbRating} | {t.duration}:{" "}
                {movieDesc.Runtime} |{" "}
                {formatReleaseDate(movieDesc.Released, props.language)}
              </div>
              <div className={styles.containerFlex}>
                <p>
                  {t.cast}: {translatedFields.actors || movieDesc.Actors}
                </p>
                <p>
                  {t.genre}: {translatedFields.genre || movieDesc.Genre}
                </p>
              </div>
            </div>
            <div className={styles.desc}>
              <p>
                {t.synopsis}: {translatedFields.plot || movieDesc.Plot}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDescription;
