import { createMuiTheme } from '@material-ui/core/styles';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const Theme = createMuiTheme({
    palette,
    typography,
    overrides,
    zIndex: {
        appBar: 1200,
        drawer: 1100
    }
}
);

export default Theme;
