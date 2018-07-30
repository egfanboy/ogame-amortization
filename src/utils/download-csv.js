import axios from 'axios';
import { saveAs } from 'file-saver';
export default queue => {
    const csvData = queue.map(({ planet, type, level }) => ({
        planet,
        building: type,
        level,
    }));

    axios
        .post('/download', JSON.stringify(csvData), {
            headers: { 'Content-type': 'application/json' },
            responseType: 'blob',
        })
        .then(res => {
            const b = new Blob([res.data]);

            saveAs(b, `amortization-${Date.now()}.csv`, {
                type: 'text/csv',
            });
        })
        .catch(console.log);
};
