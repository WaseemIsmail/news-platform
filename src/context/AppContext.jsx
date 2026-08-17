"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const AppContext = createContext(null);
const THEME_STORAGE_KEY = "contexta-theme";
const THEME_CHANGE_EVENT = "contexta-theme-change";

function getStoredTheme() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
  } catch {
    return null;
  }
}

function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getThemeSnapshot() {
  const root = document.documentElement;
  if (root.dataset.theme === "dark" || root.dataset.theme === "light") {
    return root.dataset.theme;
  }
  return root.classList.contains("dark") ? "dark" : "light";
}

function subscribeToTheme(onStoreChange) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

function applyTheme(theme, persist = false) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // The theme still works for this page when browser storage is blocked.
    }
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function AppProvider({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => "light"
  );

  useEffect(() => {
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      const nextTheme = getStoredTheme() || getPreferredTheme();
      applyTheme(nextTheme);
    };
    const handleSystemThemeChange = () => {
      if (!getStoredTheme()) syncTheme();
    };
    const handleStorageChange = (event) => {
      if (event.key === THEME_STORAGE_KEY) syncTheme();
    };
    syncTheme();

    colorSchemeQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      colorSchemeQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = getThemeSnapshot();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    // The DOM is the single source of truth. Applying and persisting together
    // prevents the button label from disagreeing with the visible page theme.
    applyTheme(nextTheme, true);
  }, []);

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const openSearchModal = () => {
    setSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setSearchModalOpen(false);
  };

  const toggleSearchModal = () => {
    setSearchModalOpen((prev) => !prev);
  };

  const clearSelections = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  const value = useMemo(
    () => ({
      /* UI states */
      mobileMenuOpen,
      searchModalOpen,
      globalLoading,
      theme,

      /* Selected filters */
      selectedCategory,
      selectedTag,

      /* UI actions */
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,

      openSearchModal,
      closeSearchModal,
      toggleSearchModal,

      setGlobalLoading,
      toggleTheme,

      /* Filters */
      setSelectedCategory,
      setSelectedTag,
      clearSelections,
    }),
    [
      mobileMenuOpen,
      searchModalOpen,
      globalLoading,
      theme,
      toggleTheme,
      selectedCategory,
      selectedTag,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside AppProvider"
    );
  }

  return context;
}

export default AppContext;
