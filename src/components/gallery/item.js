import {
    DocumentIcon,
    QuestionMarkCircleIcon,
    XCircleIcon
} from '@heroicons/react/outline';
import { forwardRef } from 'react';
import Skeleton from "react-loading-skeleton";
import { DOCUMENT, OTHER, IMAGE } from '../../libs/file';

const ButtonCopy = forwardRef(({
    children,
    ...props
}, ref) => {
    return (
        <a 
            {...props}
            ref={ref}
            className="
                m-2
                bg-emerald-600
                text-white
                delay-75
                opacity-0
                rounded
                transition
                ease-in-out
                text-sm
                mb-1
                p-1
                translate-y-1
                group-hover:translate-y-0
                group-hover:opacity-100
                hover:bg-emerald-400
                hover:text-white
            ">
            {children}
        </a>
    )
});

const ButtonLink = forwardRef(({
    children,
    ...props
}, ref) => {
    return (
        <a 
            {...props}
            ref={ref}
            className="
                m-2
                text-sky-600
                delay-75
                translate-y-1
                opacity-0
                p-1
                rounded
                transition
                ease-in-out
                text-sm
                group-hover:translate-y-0
                group-hover:opacity-100
                underline
                hover:text-sky-600
        ">
            {children}
        </a>
    )
});

const Item = ({
    loading,
    image,
    onCopyText,
    onDelete,
    allowDelete,
    i,
    ...props
}) => {
    const onDeleteClick = (e) => {
        onDelete(image, e);
    }
    if (loading) {
        return (
            <div
                className="w-1/3 sm:w-1/4 md:w-2/12 lg:w-1/12 p-1 align-middle"
                >
                <div className="rounded overflow-clip md:hover:shadow-lg">
                    <div className="bg-white h-full max-w-full align-middle justify-center h-16">
                        <Skeleton containerClassName="block h-full" className="block h-full" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div
            className="w-1/3 sm:w-1/4 md:w-2/12 lg:w-1/12 p-1 justify-center align-middle "
            >
            <div className="group p-2 md:hover:shadow-lg border rounded relative">
                {allowDelete && (
                    <a
                        width={18}
                        className="
                        absolute
                        -top-[9px]
                        -right-[9px]
                        opacity-0
                        cursor-pointer
                        group-hover:opacity-100
                        "
                        title="Delete"
                        onClick={onDeleteClick}
                    >
                        <XCircleIcon width={18} />
                    </a>
                )}
                <div className="bg-white h-full max-w-full align-middle flex justify-center h-24">
                    {image.filetype === IMAGE && (
                        <div className="
                            h-full
                            w-full
                            bg-contain
                            bg-no-repeat
                            bg-center
                            w-max-100
                            h-max-100
                            flex
                            flex-col
                            justify-center
                            items-center
                            relative
                            cursor-pointer
                            "
                            style={{
                                // backgroundImage: `url(${image.url})`,
                            }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <img src={image.url} alt={image.name} className="max-h-full max-w-full" />
                            </div>
                            <div className="absolute opacity-0 group-hover:opacity-10 rounded top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm bg-black" />
                            <div className="top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                <ButtonCopy
                                    onClick={() => {
                                        onCopyText(image.url);
                                    }}
                                    title={'Copy file URL'}
                                    >
                                    Copy URL
                                </ButtonCopy>
                                <ButtonLink
                                    href={image.url} target="_blank" rel="noopener noreferer" 
                                    >
                                    Open
                                </ButtonLink>
                            </div>
                        </div>
                    )}
                    {image.filetype === DOCUMENT && (
                        <div className="
                            h-full
                            w-full
                            bg-contain
                            bg-no-repeat
                            bg-center
                            w-max-100
                            h-max-100
                            flex
                            flex-col
                            justify-center
                            items-center
                            relative
                            cursor-pointer
                            "
                        >
                            <DocumentIcon className="h-6" />
                        </div>
                    )}
                    {image.filetype === OTHER && (
                        <div className="
                            h-full
                            w-full
                            bg-contain
                            bg-no-repeat
                            bg-center
                            w-max-100
                            h-max-100
                            flex
                            flex-col
                            justify-center
                            items-center
                            relative
                            cursor-pointer
                            "
                        >
                            <QuestionMarkCircleIcon className="h-6" />
                        </div>
                    )}
                    {/* <input className="absolute top-0 left-0 hidden" type="input" id={`name-${i}`} defaultValue={`${image.url}`} /> */}
                </div>
            </div>
            <div className="text-center text-xs p-2 break-words truncate">{image.name}</div>
        </div>
    );
}

export default Item;