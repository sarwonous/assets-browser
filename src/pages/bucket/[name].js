import Router from "next/router";
import { useEffect, useState } from "react";
import classNames from "classnames";
import toast, { Toaster } from 'react-hot-toast';

import { loadBucket } from "../../libs/bucket";
import { loadBuckets } from "../../libs/cloud";

import Header from "../../components/Header";
import Gallery from "../../components/gallery";

import styles from '../../styles/index.module.scss';
import Link from "next/link";
import to from 'await-to-js';
import axios from "axios";
import { createPortal } from "react-dom";

const notify = (text = 'URL copied to clipboard') => {
    toast.custom(
        (t) => (
            <div
                className={classNames([
                styles.notificationWrapper,
                t.visible ? "top-0" : "-top-96",
                ])}
            >
                {text}
            </div>
        ),
        { id: "unique-notification", position: "top-center" }
    )
}

const Modal = ({
    children,
    show,
}) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        if (!document?.getElementById?.('modal-root')) {
            const root = document.createElement('div');
            root.setAttribute('id', 'modal-root')
            document.body.append(root);
            setMounted(true);
        } else {
            setMounted(true);
        }
        return () => {
            setMounted(false);
        }
    }, [])
    return mounted && show ? createPortal(children, document.getElementById('modal-root')) : null;
}

const Bucket = ({
    buckets,
    name,
    allowDelete,
    allowUpload,
    ...props
}) => {
    
    const [files, setFiles] = useState([]);
    const [next, setNext] = useState(null);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [pageLoading, setPageLoading] = useState(false);
    
    const onKeywordChange = (e) => {
        setKeyword(e.target.value);
    }

    const initialize = async(cancel) => {
        setLoading(true);
        console.log('initialize');
        const { error, files, next } = await loadBucket(name, cancel);
        if (error) {
            return;
        }
        setLoading(false);
        setFiles(files);
        setNext(next);
    }

    const onBucketChange = async(e) => {
        if (e.target.value === 'all') {
            Router.push({
                pathname: "/index",
                query: {
                    name: e.target.value
                }
            }, `/`);
            return;
        }
        Router.push({
            pathname: "/bucket",
            query: {
                name: e.target.value
            }
        }, `/bucket/${e.target.value}`);
    }

    const onCopyText = (name) => {
        const el = document.getElementById(name);
        console.log('name', name);
        el.style = 'position: relative;';
        el.focus();
        el.select();
        el.setSelectionRange(0, 99999999);
        navigator.clipboard.writeText(el.value);
        el.blur()
        el.style = 'position: absolute; top:-30px; left: 0;';
        // alert('Copied to clipboard');
        notify();
    }

    useEffect(() => {
        const cancel = new AbortController();
        initialize(cancel);
        Router.events.on('routeChangeStart', () => {
            setPageLoading(true);
        });
        return () => {
            cancel.abort();
        };
    }, []);
    return (
        <>
            <Header {...props} />
            <div className="px-3">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center pt-5">
                        <div>
                            Browsing  
                            <select defaultValue={name} onChange={onBucketChange} className="shadow border pr-4 p-2 ml-2 rounded appearance-none cursor-pointer">
                                <option value='all'>All</option>
                                {buckets.map(bucket => (
                                    <option key={bucket.name} value={bucket.name}>{bucket.name}</option>
                                ))}
                            </select>
                        </div>
                        {allowUpload === 1 && (
                            <div>
                                <Link href={`/upload/${name}`}>
                                    <a className="rounded border p-2 px-5 shadow bg-slate-700 text-white">Upload New</a>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="py-5">
                        <input placeholder="Search assets" className="border w-full p-3 rounded" type="text" value={keyword} onChange={onKeywordChange}></input>
                    </div>
                    <Gallery
                        files={files}
                        loading={loading} 
                        next={next} 
                        keyword={keyword}
                        onCopyText={onCopyText}
                        allowDelete={allowDelete === 1}
                        onDelete={async(e) => {
                            const y = confirm('Are you sure you want to delete this file?');
                            if (y) {
                                const [err, ok] = await to(axios.delete(`/api/delete`, {
                                    headers: {
                                        'x-bucket-name': name,
                                        'x-file-name': e.name
                                    }
                                }));
                                if (ok) {
                                    alert('Deleted');
                                } else {
                                    alert('Failed to delete');
                                }
                            }
                        }}
                        />
                </div>
            </div>
            <Toaster />
            <Modal show>
                <div className="p-13">
                    
                </div>
            </Modal>
        </>
    );
};

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
        return `/bucket/${b.name}`;
    });
    return {
        paths: paths,
        fallback: false,
    }
}

export default Bucket;