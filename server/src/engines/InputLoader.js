import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');

class InputLoader {
    static getIncidentIds() {
        if (!fs.existsSync(DATA_DIR)) return [];
        return fs.readdirSync(DATA_DIR).filter(file => {
            return fs.statSync(path.join(DATA_DIR, file)).isDirectory();
        });
    }

    static loadIncident(id) {
        const incidentDir = path.join(DATA_DIR, id);
        if (!fs.existsSync(incidentDir)) {
            throw new Error(`Incident ${id} not found`);
        }

        const meta = JSON.parse(fs.readFileSync(path.join(incidentDir, 'meta.json'), 'utf-8'));
        const timeline = JSON.parse(fs.readFileSync(path.join(incidentDir, 'timeline.json'), 'utf-8'));
        const metrics = JSON.parse(fs.readFileSync(path.join(incidentDir, 'metrics.json'), 'utf-8'));
        const logs = fs.readFileSync(path.join(incidentDir, 'logs.txt'), 'utf-8');

        return {
            id,
            meta,
            timeline,
            metrics,
            logs
        };
    }
}

export default InputLoader;
