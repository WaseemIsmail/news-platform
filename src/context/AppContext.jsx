"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const [theme, setTheme] = useState("light");

  // ADDED: Load saved theme when app starts
  useEffect(() => {
    const savedTheme = localStorage.getItem("contexta-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      return;
    }

    setTheme("light");
  }, []);

  // ADDED: Apply theme to <html> tag and save it
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("contexta-theme", theme);
  }, [theme]);

  // ADDED: One function to switch light/dark mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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
      setTheme,
      toggleTheme, // ADDED

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