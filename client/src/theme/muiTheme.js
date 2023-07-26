
import { createMuiTheme } from '@material-ui/core/styles';
import { teal, lightBlue, red } from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: teal[900],
            contrastText: '#fff'
        },
        secondary: {
            light: lightBlue[300],
            main: lightBlue[500],
            dark: lightBlue[700],
            contrastText: '#fff'
        },
        error: {
            light: red[300],
            main: red[500],
            dark: red[700],
            contrastText: '#fff'
        }
    },
    typography: {
        useNextVariants: true
    }
});

export default theme;