import { useMemo, useState } from "react";
import styles from "./LanguageSelector.module.css";

const getFlagImageUrl = (flagCode) => {
  return `https://flagcdn.com/w320/${flagCode}.png`;
};

const LanguageSelector = ({
  languages,
  selectedLanguage,
  onLanguageChange,
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = useMemo(
    () =>
      languages.find((item) => item.code === selectedLanguage) || languages[0],
    [languages, selectedLanguage],
  );

  const handleSelect = (code) => {
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={ariaLabel}
        title={currentLanguage.label}
        style={{
          backgroundImage: `url('${getFlagImageUrl(currentLanguage.flagCode)}')`,
        }}
      />

      {isOpen && (
        <div className={styles.menu}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.option} ${
                selectedLanguage === language.code ? styles.selected : ""
              }`}
              onClick={() => handleSelect(language.code)}
            >
              <span
                className={styles.flag}
                style={{
                  backgroundImage: `url('${getFlagImageUrl(language.flagCode)}')`,
                }}
              >
                {language.flag}
              </span>
              <span className={styles.info}>
                <strong>{language.label}</strong>
                <small>{language.description}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
