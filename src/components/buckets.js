import { CollectionIcon } from "@heroicons/react/outline"
import Link from "next/link";

const Buckets = ({
    buckets
}) => {
    return (
        <div className="buckets flex justify-start py-5 flex-wrap">
            {buckets.map(bucket => (
                <div key={bucket.name} className="group bucket w-1/4 sm:w-2/12 lg:w-1/12 p-1 lg:p-2">
                    <Link href={`/bucket/${bucket.name}`}>
                        <a className="group-hover:scale-110 bg-white shadow-md cursor-pointer bucket-name flex items-center justify-center rounded border p-3 h-24 w-full">
                            <div className="icon h-8 w-8">
                                <CollectionIcon />
                            </div>
                        </a>
                    </Link>
                    <div className="w-full lg:w-24 text-center lg:p-2">
                        <Link href={`/bucket/${bucket.name}`}>
                            <a className="name text-sm whitespace-normal group-hover:underline">
                                {bucket.name}
                            </a>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Buckets;