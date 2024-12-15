import MaterialForm from '../components/material-form/material-form';
import MaterialsList from '../components/materials-list/materials-list';
import PlayerSelection from '../components/player-selection/player-selection';

const Home = () => {
    return (
        <>
            <PlayerSelection />
            <MaterialForm />
            <MaterialsList />
        </>
    );
}

export default Home;