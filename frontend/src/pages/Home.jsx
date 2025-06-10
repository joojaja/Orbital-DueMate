import CalendarCRUD from "../components/CalendarCRUD";
import Dashboard from "../components/Dashboard";

function Home() {
    return (
        <Dashboard component={<CalendarCRUD />} />
    );
}

export default Home;