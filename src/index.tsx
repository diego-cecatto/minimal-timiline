import { createRoot } from 'react-dom/client';
import { TimelineUseCase } from './pages/TimelineUseCase/TimelineUseCase';
import { Provider } from 'react-redux';
import store from './config/Store';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <Provider store={store}>
        <TimelineUseCase />
    </Provider>
);
