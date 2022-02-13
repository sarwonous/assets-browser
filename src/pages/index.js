import { useEffect, useState } from "react";
import styled from "styled-components";
import {
    DocumentIcon,
    QuestionMarkCircleIcon,
    PhotographIcon,
} from '@heroicons/react/outline';
import Skeleton from "react-loading-skeleton";

const IconType = {
    document: DocumentIcon,
    image: PhotographIcon,
    other: QuestionMarkCircleIcon,
}

const fileType = {
    "document": ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt", "rtf", "odt", "ods", "odp", "odg", "odf", "odc", "odb", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots", "otf", "odt", "odm", "ott", "ots", "otp", "otg", "oth", "ots"],
    "image": ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "heic", "heif"]
}

const Gallery = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
`;

const Thumb = styled.div`
    width: 10%;
    // padding: 0.01rem;
    // height: 1rem;
    padding: 5px;
    cursor: pointer;
    input {
        position: absolute;
        top:-30px;
        left: 0;
    }
    > div {
        border-radius: 4px;
        border: 1px solid #9bb3c7;
        background-color: #d4ebff;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    img {
        width: 100%;
        height: 100%;
    }
`;

const Image = styled.div`
    &&& {
       
    }
`;

const Title = styled.h1`
    padding: 0 10px;
`;

const Item = ({
    loading,
    image,
    setSelectedImage,
    copyText,
    i,
    ...props
}) => {
    if (loading) {
        return (
            <div
                className="w-1/2 sm:w-1/4 md:w-1/12 p-1 align-middle"
                >
                <div className="rounded overflow-clip md:hover:shadow-lg cursor-pointer ">
                    <div className="bg-white h-full max-w-full align-middle justify-center h-16">
                        <Skeleton containerClassName="block h-full" className="block h-full" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div
            className="w-1/2 sm:w-1/4 md:w-1/12 p-1 justify-center align-middle "
            onClick={() => {
                if (loading) return;
                if (fileType.image.includes(image.filetype)) {
                    setSelectedImage(image);
                }
                copyText(`name-${image.i}`);
            }}
            >
            <div className="p-2 overflow-clip md:hover:shadow-lg cursor-pointer border rounded ">
                <div className="bg-white h-full max-w-full align-middle flex justify-center h-16">
                    {fileType.image.includes(image.filetype) && (
                        <img className="w-max-100 h-max-100" src={image.url} alt={image.name} />
                    )}
                    {fileType.document.includes(image.filetype) && (
                        <DocumentIcon className="hidden" />
                    )}
                    {image.other && (
                        <QuestionMarkCircleIcon className="hidden"  />
                    )}
                    <input className="absolute top-0 left-0 hidden" type="input" id={`name-${image.i}`} value={`${image.url}`} />
                </div>
            </div>
            <div className="text-center text-xs p-2">{image.name}</div>
        </div>
    );
}

function HomePage({ data = [], start_path, ...props }) {
    const [loadingAssests, setLoadingAssets] = useState(false);
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [keyword, setKeyword] = useState('')
    useEffect(() => {
        const cancel = new window.AbortController();
        const init = async () => {
            setLoadingAssets(true);
            try {
                const res = await fetch(`/api/path/${start_path}`, {
                    signal: cancel.signal
                });
                const { files, next } = await res.json();
                setFiles(files.map((f, i) => ({ ...f, i })));
                setFilteredFiles(files.map((f, i) => ({ ...f, i })));
                setLoadingAssets(false);
            } catch (error) {
                setLoadingAssets(false);
            }
        };
        init();

        return () => {
            // second
            cancel.abort();
        }
    }, [])
    
    const copyText = (name) => {
        const el = document.getElementById(name);
        console.log('name', name);
        el.style = 'position: relative;';
        el.focus();
        el.select();
        el.setSelectionRange(0, 99999999);
        navigator.clipboard.writeText(el.value);
        el.blur()
        el.style = 'position: absolute; top:-30px; left: 0;';
        alert('Copied to clipboard');
    }

    const startLoad = () => {
        setLoading(false);
    }

    const onError = () => {
        setLoading(false);
    }

    const onKeywordChange = (e) => {
        setKeyword(e.target.value);
    }

    useEffect(() => {
        setFilteredFiles(files.filter(t => {
            return t.name.indexOf(keyword) > -1;
        }))
    }, [keyword])

    return (
        <>
            <div className="bg-slate-800 text-white p-3">
                <div className="container mx-auto">
                    <div>
                        <h1 className="text-4xl py-3">Okadoc Images</h1>
                        <p className="">Collection icon on Okadoc Assets</p>
                    </div>
                </div>
            </div>
            <div className="container mx-auto">
                <div className="py-5">
                    <input placeholder="Search assets" className="border w-full p-3 rounded" type="text" value={keyword} onChange={onKeywordChange}></input>
                </div>
                <div className="w-1/1">
                    <div className="flex flex-wrap overflow-y-auto">
                        {loadingAssests && (Array.from(Array(18).keys())).map(i => (
                            <Item
                                key={i}
                                loading
                                />
                        ))}
                        {!loadingAssests && filteredFiles.map((image, i) => {
                            image.other = !fileType.document.includes(image.filetype) && !fileType.image.includes(image.filetype);
                            if (!image || (image.url && image.url.indexOf("http") < 0))
                                return null;
                            return (
                                <Item
                                    key={i}
                                    image={image}
                                    setSelectedImage={setSelectedImage}
                                    copyText={copyText}
                                    />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getStaticProps() {
  return {
    props: {
      start_path: process.env.START_PATH,
    }, // will be passed to the page component as props
    revalidate: 1
  };
}

export default HomePage;
