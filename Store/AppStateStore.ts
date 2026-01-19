import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface App {
  useDeviceColorScheme: boolean;
  darkMode: boolean;
  setUseDeviceColorScheme: (enable: boolean) => void;
  setDarkMode: (enable: boolean) => void;
  enableDarkMode: () => void;
  disableDarkMode: () => void;
}


const AppStateStore = create<App>()(persist((set, get) => {
  return {
    useDeviceColorScheme: true,
    darkMode: true,
    setUseDeviceColorScheme: (enable) => set({ useDeviceColorScheme: enable }),
    enableDarkMode: () => set({ darkMode: true }),
    disableDarkMode: () => set({ darkMode: false }),
    setDarkMode: (mode) => set({ darkMode: mode }),
  }
}, { name: "app-state-store", storage: createJSONStorage(() => AsyncStorage) }))

export default AppStateStore;