import 'react-loading-skeleton/dist/skeleton.css'
import "../styles/app.scss";
const App = ({
    Component,
    pageProps
}) => {
    return (
        <Component {...pageProps} />
    )
};

export default App;