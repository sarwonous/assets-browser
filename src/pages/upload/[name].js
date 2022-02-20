import Link from 'next/link';
import Upload from "../../components/upload";
import { loadBuckets } from "../../libs/cloud";

function UploadPage({
    name = [],
    ...props
}) {
    return (
        <>
            <div className="bg-slate-800 text-white px-3">
                <div className="container mx-auto">
                    <div className="py-5">
                        <h1 className="text-2xl sm:text-4xl py-3 text-center sm:text-left">
                            <Link href="/">
                                <a>
                                    {props.site_title}
                                </a>
                            </Link>
                        </h1>
                        <p className=" text-center sm:text-left">{props.site_description}</p>
                    </div>
                </div>
            </div>
            <div className="px-3">
                <div className="container mx-auto">
                    <div className="py-10 flex flex-col items-center">
                        <div className="flex justify-between items-center pt-5 pb-3 w-1/2">
                            <Link href={`/bucket/${name}`}>
                                <a>
                                    Back to {name}  
                                </a>
                            </Link>
                        </div>
                        
                        <Upload name={name} />
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getStaticProps({ params }) {
    const { name } = params;
    const buckets = await loadBuckets();
    const bucket = buckets.find(bucket => bucket.name === name);
    if (!bucket) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            buckets,
            name,
            allowUpload: +process.env.ALLOW_UPLOAD || 0,
            allowDelete: +process.env.ALLOW_DELETE || 0,
            site_title: process.env.SITE_TITLE || '',
            site_description: process.env.SITE_DESCRIPTION || '',
        }, // will be passed to the page component as props
        revalidate: 1
    };
}

export async function getStaticPaths() {
    const buckets = await loadBuckets();
    const paths = buckets.map(b => {
        return `/upload/${b.name}`;
    });
    return {
        paths: paths,
        fallback: false,
    }
}

export default UploadPage;