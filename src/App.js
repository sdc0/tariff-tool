import MaterialForm from './components/material-form/material-form';
import TariffForm from './components/tariff-form/tariff-form';
import MaterialsList from './components/materials-list/materials-list';

import { RawMaterialsProvider, ProcessedMaterialsProvider } from './models/material';

import './App.css';

function App() {
    return (
        <div className="App">
            <RawMaterialsProvider>
                <ProcessedMaterialsProvider>
                    <MaterialForm />
                    <TariffForm />
                    <MaterialsList />
                </ProcessedMaterialsProvider>
            </RawMaterialsProvider>
        </div>
    );
}

export default App;
