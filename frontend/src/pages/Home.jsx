import Calendar from "../components/calendar";
import Dashboard from "../components/Dashboard";

function Home() {
    return (
        <Dashboard component={<Calendar />} />
    );
}

export default Home;