import MaterialForm from './components/material-form/material-form';
import TariffForm from './components/tariff-form/tariff-form';
import MaterialsList from './components/materials-list/materials-list';
import TariffsList from './components/tariffs-list/tariffs-list';

import { RawMaterialsProvider, ProcessedMaterialsProvider } from './models/material';
import { TariffsProvider } from './models/tariff';

import './App.css';

function App() {
    return (
        <div className="App">
            <RawMaterialsProvider>
                <ProcessedMaterialsProvider>
                    <TariffsProvider>
                        <MaterialForm />
                        <TariffForm />
                        <div style={{display: 'inline-flex'}}>
                            <MaterialsList />
                            <TariffsList />
                        </div>
                    </TariffsProvider>
                </ProcessedMaterialsProvider>
            </RawMaterialsProvider>
        </div>
    );
}

export default App;
