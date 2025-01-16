import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use __dirname as needed
export default {
  webpack: (config) => {
    config.resolve.alias['@components'] = path.resolve(__dirname, 'components');
    return config;
  },
};
