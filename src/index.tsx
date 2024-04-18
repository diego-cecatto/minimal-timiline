import { createRoot } from 'react-dom/client';
import { TimelineUseCase } from './pages/timeline/TimelineUseCase';
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <>
        <TimelineUseCase />
    </>
);
