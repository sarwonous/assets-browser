import { loadBuckets } from "../libs/cloud";
import Buckets from "../components/buckets";

function HomePage({
    buckets = [],
    ...props
}) {
    return (
        <>
            <div className="bg-slate-800 text-white px-3">
                <div className="container mx-auto">
                    <div className="py-5">
                        <h1 className="text-2xl sm:text-4xl py-3 text-center sm:text-left">{props.site_title}</h1>
                        <p className=" text-center sm:text-left">{props.site_description}</p>
                    </div>
                </div>
            </div>

            <div className="px-3">
                <div className="container mx-auto">
                    <Buckets buckets={buckets} />
                </div>
            </div>
        </>
    );
}

export async function getStaticProps() {
    let buckets;
    try {
        buckets = await loadBuckets();
    } catch (error) {
        buckets = [];
    }
    return {
        props: {
            buckets,
            start_path: process.env.START_PATH || '',
            site_title: process.env.SITE_TITLE || '',
            site_description: process.env.SITE_DESCRIPTION || '',
        }, // will be passed to the page component as props
        revalidate: 1
    };
}

export default HomePage;
