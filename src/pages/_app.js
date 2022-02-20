import 'react-loading-skeleton/dist/skeleton.css'
import "nprogress/nprogress.css";
import "../styles/app.scss";
import dynamic from 'next/dynamic';

const TopProgressBar = dynamic(
    () => {
        return import("../components/TopProgressBar");
    },
    { ssr: false },
);

const App = ({
    Component,
    pageProps,
    ...props
}) => {
    return (
        <>
            <TopProgressBar />
            <Component {...pageProps} />
        </>
    )
};

export async function getStaticProps({}) {
    return {
        props: {
            site_title: process.env.SITE_TITLE || '',
            site_description: process.env.SITE_DESCRIPTION || '',
        },
    };
}

export default App;