import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import AgeCalculator from "../components/age-calculator/AgeCalculator";
import BackgroundGenerator from "../components/background-generator/BackgroundGenerator";
import ContactForm from "../components/contact-form/ContactForm";
import BatteryIndicator from "../components/battery-indicator/BatteryIndicator";
import CalculatorApp from "../components/calculator-app/CalculatorApp";
import CatGenerator from "../components/cat-generator/CatGenerator";
import ColorGuessingGame from "../components/color-guessing-game/ColorGuessingGame";
import CustomSlider from "../components/custon-slider/CustomSlider";
import DigitalClock from "../components/digital-clock/DigitalClock";
import BMICalculator from "../components/bmi-calculator/BmiCalculator";
import ExpandButton from "../components/expand-button/ExpandButton";
import BlogApplication from "../components/blog-application/BlogApplication";
import CountdownTimer from "../components/countdown-timer/CountdownTimer";
import CompoundInterestCalculator from "../components/compound-interest-calculator/CompoundInterestCalculator";
import FaqAccordion from "../components/faq-accordion/FaqAccordion";
import FlimFinderLayout from "../components/flim-finder/FlimFinderLayout";
import WeatherApp from "../components/weather-app/WeatherApp";
import PasswordGenerator from "../components/password-generator/PasswordGenerator";
import QuizApp from "../components/quiz-app/QuizApp";
import ExpenseTracker from "../components/expense-tracker/ExpenseTracker";
import TodoList from "../components/todo-list/TodoList";
import MusicPlayer from "../components/music-player/MusicPlayer";
import ImageGallery from "../components/image-gallery/ImageGallery";
import HabitTracker from "../components/habit-tracker/HabitTracker";
import RecipeFinder from "../components/recipe-finder/RecipeFinder";
import UrlShortener from "../components/url-shortener/UrlShortener";
import PomodoroTimer from "../components/pomodoro-timer/PomodoroTimer";
import MarkdownEditor from "../components/markdown-editor/MarkdownEditor";
import QRGenerator from "../components/qr-generator/QRGenerator";
import ColorPalette from "../components/color-palette/ColorPalette";
interface IProjectDetails {
  title: string;
  path: string;
  component: string;
  description: string;
  icon: string;
  date_of_creation: string | number | Date;
}

// Map string component names to actual React components
const componentMap: Record<string, React.ComponentType> = {
  AgeCalculator,
  BackgroundGenerator,
  ContactForm,
  BatteryIndicator,
  CalculatorApp,
  CatGenerator,
  ColorGuessingGame,
  CustomSlider,
  DigitalClock,
  BMICalculator,
  ExpandButton,
  BlogApplication,
  CountdownTimer,
  CompoundInterestCalculator,
  FaqAccordion,
  FlimFinderLayout,
  WeatherApp,
  PasswordGenerator,
  QuizApp,
  ExpenseTracker,
  TodoList,
  MusicPlayer,
  ImageGallery,
  HabitTracker,
  RecipeFinder,
  UrlShortener,
  PomodoroTimer,
  MarkdownEditor,
  QRGenerator,
  ColorPalette,
};

const AppRoutes = () => {
  const [projects, setProjects] = useState<IProjectDetails[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/projects`)
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<HomePage />} />

          {/* Dynamic project routes */}
          {projects.map((item, index) => {
            const Component = componentMap[item.component];
            if (!Component) return null;
            return (
              <Route key={index} path={item.path} element={<Component />} />
            );
          })}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
