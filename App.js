import "./global.css";
import { AppProvider } from "./config/app-context";
import { ThemeToggleProvider } from "./config/theme-context";
import { ToastProvider } from "./utilities/ToastService";
import { AppNav } from "./screens/AppNav";

export default function App() {
  return (
    <AppProvider>
      <ThemeToggleProvider>
        <ToastProvider>
          <AppNav />
        </ToastProvider>
      </ThemeToggleProvider>
    </AppProvider>
  );
}
