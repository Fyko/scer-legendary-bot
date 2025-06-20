import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import LeaderboardPage from './pages/LeaderboardPage';
import UserPage from './pages/UserPage';

export default function App() {
	const { theme, setTheme } = useTheme();

	return (
		<Router>
			<Routes>
				<Route 
					path="/" 
					element={<LeaderboardPage theme={theme} setTheme={setTheme} />} 
				/>
				<Route 
					path="/users/:user_id" 
					element={<UserPage />} 
				/>
			</Routes>
		</Router>
	);
}
